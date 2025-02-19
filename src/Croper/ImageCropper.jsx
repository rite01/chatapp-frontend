import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Dialog, Button, Slider } from "@mui/material";

const ImageCropper = ({ open, image, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => setCrop(crop);
  const onZoomChange = (zoom) => setZoom(zoom);
  const onCropCompleteHandler = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCrop = () => {
    onCropComplete(croppedAreaPixels);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <div style={{ position: "relative", width: "100%", height: 400 }}>
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteHandler}
          onZoomChange={onZoomChange}
        />
      </div>
      <Slider
        value={zoom}
        min={1}
        max={3}
        step={0.1}
        onChange={(e, zoom) => setZoom(zoom)}
      />
      <Button onClick={handleCrop} variant="contained" color="primary">
        Crop & Save
      </Button>
    </Dialog>
  );
};

export default ImageCropper;
