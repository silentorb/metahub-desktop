
export function getProjectConfigDirectory(root: string) {
  return `${root}/.metahub/config`
}

export const  getConfigFilePath = (root: string) => (key: string) => {
  const configPath = getProjectConfigDirectory(root)
  return `${configPath}/${key.replace(/\//, '.')}.json`
}
