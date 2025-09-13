import JSZip from 'jszip';
import { ProjectFile } from '@/types/project';

/**
 * Recursively adds files and folders to a ZIP archive
 */
function addToZip(zip: JSZip, files: ProjectFile[], basePath: string = ''): void {
  files.forEach((file) => {
    const filePath = basePath ? `${basePath}/${file.name}` : file.name;
    
    if (file.type === 'folder' && file.children) {
      // Create a folder in the ZIP
      const folder = zip.folder(file.name);
      if (folder) {
        addToZip(folder, file.children, '');
      }
    } else if (file.type === 'file' && file.content !== undefined) {
      // Add file content to the ZIP
      zip.file(filePath, file.content);
    }
  });
}

/**
 * Creates a ZIP file from a project's folder structure
 */
export async function createProjectZip(
  projectName: string,
  folderStructure: ProjectFile[]
): Promise<Blob> {
  const zip = new JSZip();
  
  // Add all files and folders to the ZIP
  addToZip(zip, folderStructure);
  
  // Generate the ZIP file
  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: {
      level: 6
    }
  });
  
  return zipBlob;
}

/**
 * Downloads a ZIP file
 */
export function downloadZip(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Creates and downloads a project as a ZIP file
 */
export async function downloadProjectAsZip(
  projectName: string,
  folderStructure: ProjectFile[]
): Promise<void> {
  try {
    const zipBlob = await createProjectZip(projectName, folderStructure);
    const sanitizedProjectName = projectName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    downloadZip(zipBlob, sanitizedProjectName);
  } catch (error) {
    console.error('Error creating ZIP file:', error);
    throw new Error('Failed to create ZIP file');
  }
}
