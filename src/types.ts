export type QueryResult = {
  values: string[]
}[]

export interface FileEntry {
  fileUri: string
}

export interface FileEntryWithLabel extends FileEntry {
  label: string
}

export interface FolderEntry {
  folderUri: string
}

export interface FolderEntryWithLabel extends FolderEntry {
  label: string
}

export interface WorkspaceEntry {
  workspace: {
    configPath: string
  }
}

export interface WorkspaceEntryWithLabel extends WorkspaceEntry {
  label: string
}

export interface RemoteEntry {
  folderUri: string
  remoteAuthority: string
  label: string
}

export type EntryLike = FolderEntry | FileEntry | WorkspaceEntry | RemoteEntry

export type EntryLikeWithLabel =
  | FolderEntryWithLabel
  | FileEntryWithLabel
  | WorkspaceEntryWithLabel
  | RemoteEntry
