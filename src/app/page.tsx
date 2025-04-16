'use client';

import {useState, useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import {Button} from '@/components/ui/button';
import {Textarea} from '@/components/ui/textarea';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {extractContactData} from '@/ai/flows/extract-contact-data';
import {Download, Edit, Upload} from 'lucide-react';
import {toast} from "@/hooks/use-toast"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

const initialContactData = {
  senderName: '',
  senderPhoneNumber: '',
  receiverName: '',
  receiverPhoneNumber: '',
  receiverAddress: '',
};

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export default function Home() {
  const [extractedData, setExtractedData] = useState(initialContactData);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setImageUrl(URL.createObjectURL(file));
    setIsLoading(true);

    try {
      const base64String = await fileToBase64(file);
      const fileType = file.type;
      const photoUrl = URL.createObjectURL(file);

      const extracted = await extractContactData({photoUrl: photoUrl, fileType: fileType, base64String: base64String});
      setExtractedData(extracted);
      toast({
        title: "Success",
        description: "Contact data has been extracted."
      })
    } catch (error: any) {
      console.error('Extraction failed', error);
      toast({
        title: "Error",
        description: "Failed to extract contact data."
      })
    } finally {
      setIsLoading(false);
    }
  }, []);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  const handleDataChange = (
    field: keyof typeof extractedData,
    value: string
  ) => {
    setExtractedData({...extractedData, [field]: value});
  };

  const downloadCsv = () => {
    const csvData =
      'Sender Name,Sender Phone Number,Receiver Name,Receiver Phone Number,Receiver Address\n' +
      `${extractedData.senderName},${extractedData.senderPhoneNumber},${extractedData.receiverName},${extractedData.receiverPhoneNumber},${extractedData.receiverAddress}`;
    const blob = new Blob([csvData], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact_data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Success",
      description: "CSV has been downloaded."
    })
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-secondary p-4">
      <h1 className="text-2xl font-bold mb-4 text-primary">
        Handy Contact Extractor
      </h1>

      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full max-w-md p-6 mb-4 border-2 border-primary border-dashed rounded-md cursor-pointer bg-background ${
          isDragActive ? 'border-accent' : ''
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-6 w-6 text-primary mb-2" />
        <p className="text-sm text-muted-foreground">
          {isDragActive
            ? 'Drop the image here...'
            : 'Click or drag an image of a contact card here to extract data.'}
        </p>
        {isLoading && <p>Loading...</p>}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Uploaded Contact Card"
            className="max-w-full max-h-48 mt-4 rounded-md"
          />
        )}
      </div>

      <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Extracted Contact Information</CardTitle>
              <CardDescription>Review and edit the extracted data.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-none pl-0">
                <li className="mb-2">
                  <strong className="font-semibold">Sender Name:</strong> {extractedData.senderName}
                </li>
                <li className="mb-2">
                  <strong className="font-semibold">Sender Phone Number:</strong> {extractedData.senderPhoneNumber}
                </li>
                <li className="mb-2">
                  <strong className="font-semibold">Receiver Name:</strong> {extractedData.receiverName}
                </li>
                <li className="mb-2">
                  <strong className="font-semibold">Receiver Phone Number:</strong> {extractedData.receiverPhoneNumber}
                </li>
                <li>
                  <strong className="font-semibold">Receiver Address:</strong> {extractedData.receiverAddress}
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={downloadCsv} className="w-full bg-accent text-background hover:bg-accent-foreground hover:text-primary">
                <Download className="h-4 w-4 mr-2" />
                Download CSV
              </Button>
            </CardFooter>
          </Card>
      </div>
    </div>
  );
}
