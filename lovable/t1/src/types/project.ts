export interface ProjectFile {
  name: string;
  content?: string;
  type: 'file' | 'folder';
  language?: string;
  children?: ProjectFile[];
  path: string;
}

export interface GeneratedProject {
  id: string;
  name: string;
  description: string;
  framework: string;
  styling: string;
  projectType: string;
  files: ProjectFile[];
  folderStructure: ProjectFile[];
  packageJson?: {
    name: string;
    version: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    scripts: Record<string, string>;
  };
  readme?: string;
  createdAt: string;
  prompt: string;
}

export interface ProjectGenerationRequest {
  prompt: string;
  framework?: string;
  features?: string[];
  styling?: string;
}

export interface ProjectGenerationResponse {
  success: boolean;
  project?: GeneratedProject;
  error?: string;
  progress?: number;
}
