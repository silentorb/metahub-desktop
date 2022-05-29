import { getFromContainer, MetadataStorage, ValidationError } from 'class-validator'
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata'
// import { defaultMetadataStorage } from 'class-transformer/storage'
import { flatten } from '../utility'

const metadataStorage = getFromContainer(MetadataStorage)

export interface FieldMetaData {
  name: string
  isRequired: boolean
  nestedType?: InterfaceMetaData
}

export interface InterfaceMetaData {
  fields: FieldMetaData[]
}

function hasDecorator(decorators: ValidationMetadata[], type: string): boolean {
  return decorators.some(d => d.type == type)
}

// export function compileMetaData(object: any): InterfaceMetaData {
//   const targetMetadatas = metadataStorage.getTargetValidationMetadatas(object.constructor, undefined as any, undefined)
//   const groupedMetadatas = metadataStorage.groupByPropertyName(targetMetadatas)
//
//   const fields: FieldMetaData[] = Object.keys(groupedMetadatas).map(propertyName => {
//     const decorators = groupedMetadatas[propertyName]
//     let nestedType: InterfaceMetaData | undefined
//     const nestedDecorator = decorators.filter(d => d.type == 'nestedValidation')[0]
//     if (nestedDecorator) {
//       const typeMeta = defaultMetadataStorage.findTypeMetadata(object.constructor, propertyName)
//       if (nestedDecorator.each && typeMeta.typeFunction()) {
//         const tempType = typeMeta.typeFunction() as any
//         const tempObject = new tempType()
//         nestedType = compileMetaData(tempObject)
//       } else {
//         const tempObject = new typeMeta.reflectedType()
//         nestedType = compileMetaData(tempObject)
//       }
//     } else nestedType = undefined
//
//     return {
//       name: propertyName,
//       isRequired: !hasDecorator(decorators, 'conditionalValidation'),
//       nestedType,
//     }
//   })
//   return {
//     fields,
//   }
// }

export function validateMissingArrayFields(metaData: InterfaceMetaData, value: any[], path: string = ''): ValidationError[] {
  return metaData.fields.length > 0
    ? flatten(value.map(item => validateMissingFields(metaData, item, path)))
    : []
}

export function validateMissingFields(metaData: InterfaceMetaData, value: any, path: string = ''): ValidationError[] {
  const localErrors: ValidationError[] = metaData.fields
    .filter(field => field.isRequired && value[field.name] === undefined)
    .map(field => ({
      property: field.name,
      constraints: { [field.name]: `Missing "${path}${field.name}" field` },
      children: [],
    }))
  const nestedErrors: ValidationError[] = flatten(
    metaData.fields
      .filter(field => field.nestedType && value[field.name] !== undefined)
      .map(field => {
        const childValue = value[field.name]
        const childPath = path + field.name + '.'
        return Array.isArray(childValue)
          ? validateMissingArrayFields(field.nestedType!, childValue, childPath)
          : validateMissingFields(field.nestedType!, childValue, childPath)
      })
  )

  return localErrors.concat(nestedErrors)
}

export function validateUnknownArrayFields(metaData: InterfaceMetaData, value: any[], path: string = ''): ValidationError[] {
  return metaData.fields.length > 0
    ? flatten(value.map(item => validateUnknownFields(metaData, item, path)))
    : []
}

export function validateUnknownFields(metaData: InterfaceMetaData, value: any, path: string = ''): ValidationError[] {
  const field = metaData.fields.map(res => res.name)
  const localErrors: ValidationError[] = Object.keys(value)
    .filter(res => !field.includes(res))
    .map(res => ({
      property: res,
      constraints: { [res]: `Unknown "${path}${res}" field` },
      children: [],
    }))

  const nestedErrors: ValidationError[] = flatten(
    metaData.fields
      .filter(field => field.nestedType && value[field.name] !== undefined)
      .map(field => {
        const childValue = value[field.name]
        const childPath = path + field.name + '.'
        return Array.isArray(childValue)
          ? validateUnknownArrayFields(field.nestedType!, childValue, childPath)
          : validateUnknownFields(field.nestedType!, childValue, childPath)
      })
  )

  return localErrors.concat(nestedErrors)
}
