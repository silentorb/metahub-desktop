
export function getConfigPath(root: string) {
  return `${root}/.metahub`
}

export function getWorkspaceConfigPath(root: string) {
  const configPath = getConfigPath(root)
  return `${configPath}/workspace.json`
}
