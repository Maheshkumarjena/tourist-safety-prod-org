import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  File, 
  Image, 
  Mic, 
  X, 
  Check,
  AlertCircle
} from 'lucide-react';
// import { userAPI } from '@/lib/api';
// Temporarily disabled to isolate error

interface MediaUploadProps {
  onUpload?: (mediaUrl: string) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  allowMultiple?: boolean;
  purpose?: 'kyc' | 'panic' | 'profile';
}

interface UploadedFile {
  file: File;
  preview?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  url?: string;
  error?: string;
}

export const MediaUpload = ({
  onUpload,
  acceptedTypes = ['image/*', 'audio/*'],
  maxSize = 10,
  allowMultiple = false,
  purpose = 'profile'
}: MediaUploadProps) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.replace('/*', '/'));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `File type not supported. Accepted: ${acceptedTypes.join(', ')}`;
    }

    return null;
  };

  const createPreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const uploadFile = async (uploadedFile: UploadedFile, index: number) => {
    try {
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'uploading', progress: 0 } : f
      ));

      const formData = new FormData();
      formData.append('file', uploadedFile.file);
      formData.append('purpose', purpose);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map((f, i) => 
          i === index && f.progress < 90 
            ? { ...f, progress: f.progress + 10 } 
            : f
        ));
      }, 200);

      // Use existing API - for now we'll mock the media upload
      // In real implementation, this would call the media upload endpoint
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);

      const mockUrl = `https://example.com/media/${Date.now()}-${uploadedFile.file.name}`;

      setFiles(prev => prev.map((f, i) => 
        i === index 
          ? { ...f, status: 'success', progress: 100, url: mockUrl }
          : f
      ));

      onUpload?.(mockUrl);

      toast({
        title: "Upload successful",
        description: "File uploaded successfully",
      });

    } catch (error) {
      setFiles(prev => prev.map((f, i) => 
        i === index 
          ? { ...f, status: 'error', error: 'Upload failed' }
          : f
      ));

      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleFiles = async (selectedFiles: FileList) => {
    const newFiles: UploadedFile[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const error = validateFile(file);

      if (error) {
        toast({
          title: "File validation failed",
          description: error,
          variant: "destructive",
        });
        continue;
      }

      const preview = await createPreview(file);
      newFiles.push({
        file,
        preview,
        status: 'pending',
        progress: 0,
      });
    }

    if (!allowMultiple) {
      setFiles(newFiles.slice(0, 1));
    } else {
      setFiles(prev => [...prev, ...newFiles]);
    }

    // Auto-upload files
    newFiles.forEach((uploadedFile, index) => {
      const actualIndex = allowMultiple ? files.length + index : index;
      uploadFile(uploadedFile, actualIndex);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-8 h-8" />;
    if (file.type.startsWith('audio/')) return <Mic className="w-8 h-8" />;
    return <File className="w-8 h-8" />;
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
      >
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">
                {isDragging ? 'Drop files here' : 'Upload files'}
              </h3>
              <p className="text-muted-foreground mb-4">
                Drag and drop files here, or click to select
              </p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
              >
                Choose Files
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>Accepted: {acceptedTypes.join(', ')}</p>
              <p>Max size: {maxSize}MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={acceptedTypes.join(',')}
        multiple={allowMultiple}
        onChange={handleFileInput}
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          {files.map((uploadedFile, index) => (
            <motion.div
              key={`${uploadedFile.file.name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg p-4"
            >
              <div className="flex items-center gap-4">
                {/* File Preview/Icon */}
                <div className="flex-shrink-0">
                  {uploadedFile.preview ? (
                    <img 
                      src={uploadedFile.preview} 
                      alt="Preview" 
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                      {getFileIcon(uploadedFile.file)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  
                  {/* Progress Bar */}
                  {uploadedFile.status === 'uploading' && (
                    <div className="mt-2">
                      <Progress value={uploadedFile.progress} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {uploadedFile.progress}% uploaded
                      </p>
                    </div>
                  )}

                  {/* Error Message */}
                  {uploadedFile.status === 'error' && (
                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {uploadedFile.error}
                    </p>
                  )}
                </div>

                {/* Status Icon */}
                <div className="flex-shrink-0">
                  {uploadedFile.status === 'success' && (
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                  {uploadedFile.status === 'error' && (
                    <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="ml-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};