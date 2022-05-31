
export function getConfigDirectory(root: string) {
  return `${root}/.metahub`
}

export const  getConfigFilePath = (root: string) => (key: string) => {
  const configPath = getConfigDirectory(root)
  return `${configPath}/${key.replace(/\//, '.')}.json`
}
