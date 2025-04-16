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

const initialContactData = {
  senderName: '',
  senderPhoneNumber: '',
  receiverName: '',
  receiverPhoneNumber: '',
  receiverAddress: '',
};

export default function Home() {
  const [extractedData, setExtractedData] = useState(initialContactData);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setImageUrl(URL.createObjectURL(file));
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      const photoUrl = URL.createObjectURL(file);

      const extracted = await extractContactData({photoUrl});
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
        <div className="mb-4">
          <Label htmlFor="senderName">Sender Name</Label>
          <Input
            type="text"
            id="senderName"
            value={extractedData.senderName}
            onChange={(e) => handleDataChange('senderName', e.target.value)}
            className="shadow-sm"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="senderPhoneNumber">Sender Phone Number</Label>
          <Input
            type="text"
            id="senderPhoneNumber"
            value={extractedData.senderPhoneNumber}
            onChange={(e) =>
              handleDataChange('senderPhoneNumber', e.target.value)
            }
            className="shadow-sm"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="receiverName">Receiver Name</Label>
          <Input
            type="text"
            id="receiverName"
            value={extractedData.receiverName}
            onChange={(e) => handleDataChange('receiverName', e.target.value)}
            className="shadow-sm"
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="receiverPhoneNumber">Receiver Phone Number</Label>
          <Input
            type="text"
            id="receiverPhoneNumber"
            value={extractedData.receiverPhoneNumber}
            onChange={(e) =>
              handleDataChange('receiverPhoneNumber', e.target.value)
            }
            className="shadow-sm"
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="receiverAddress">Receiver Address</Label>
          <Textarea
            id="receiverAddress"
            value={extractedData.receiverAddress}
            onChange={(e) => handleDataChange('receiverAddress', e.target.value)}
            className="shadow-sm"
          />
        </div>

        <Button onClick={downloadCsv} className="w-full bg-accent text-background hover:bg-accent-foreground hover:text-primary">
          <Download className="h-4 w-4 mr-2" />
          Download CSV
        </Button>
      </div>
    </div>
  );
}
