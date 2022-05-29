import { validate, ValidateNested, ValidationOptions } from 'class-validator'
import { plainToInstance, Type } from 'class-transformer'
import { ValidationError } from 'class-validator/types/validation/ValidationError'
import { Task } from 'fp-ts/Task'
import { TaskEither } from 'fp-ts/TaskEither'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'

export function decoratorBundle(validators: any[]) {
  return function () {
    return function (object: object, propertyName: string) {
      for (const validator of validators) {
        new validator(object, propertyName)
      }
    }
  }
}

// When validating nested data, class-validator and class-transformer each need to be informed about the nesting
// using their own decorator.  This helper bundles both decorators.
export const Nested = (type: any, validationOptions?: ValidationOptions) =>
  decoratorBundle([ValidateNested(validationOptions), Type(() => type)])()

export const NestedArray = (type: any) => Nested(type, { each: true })

interface ValidationErrors extends Error {
  errors: ValidationError[]
}

export const validateObject = <T>(type: any) => (object: any): TaskEither<Error, T> => {
  const converted = plainToInstance(type, object)
  return pipe(
    TE.tryCatch(
      () => validate(converted, { forbidUnknownValues: true }),
      reason => new Error(`${reason}`)
    ),
    TE.chain(
      errors => errors.length == 0
        ? TE.right(object)
        : TE.left({ message: 'Invalid object format', errors, name: 'ValidationErrors' })
    )
  )
  // const missingFieldErrors = validateMissingFields(metaData, converted)
  // const unknownFieldErrors = validateUnknownFields(metaData, converted)
  // return errors.concat(missingFieldErrors).concat(unknownFieldErrors)
}
