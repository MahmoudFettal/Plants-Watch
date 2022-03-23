import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import { CardMedia } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import Modal from "@mui/material/Modal";
import { DropzoneArea } from "material-ui-dropzone";

const axios = require("axios").default;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "white",
  boxShadow: 24,
  p: 4,
};
function Home() {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [plant, setPlant] = useState("potato");
  const [enter, setEnter] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  let confidence = 0;

  useEffect(() => {
    if (!open && data) predictionsScroll();
  }, [open]);

  const sendFile = async () => {
    if (image) {
      let formData = new FormData();
      formData.append("file", selectedFile);
      let res = await axios({
        method: "post",
        url: `https://plantwatch2.azurewebsites.net/predict_${plant}`,
        data: formData,
      });
      if (res.status === 200) {
        setData(res.data);
        console.log(res.data);
      }
      setIsloading(false);
    }
  };

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) {
      return;
    }
    setIsloading(true);
    sendFile();
  }, [preview]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(0);
  }
  const predictions = useRef(null);

  const predictionsScroll = () => {
    predictions.current.scrollIntoView();
  };

  const plantHandler = (e) => {
    setPlant(e.target.value);
    console.log(plant);
  };

  return (
    <>
      {" "}
      <div
        className="w-screen h-screen"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundImage: `url("https://images.unsplash.com/photo-1593708697557-f2feca483132?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80")`,
        }}
      >
        <div className="flex flex-col w-screen h-screen px-20 py-10 bg-black/25 items-center justify-between">
          <nav className="flex w-full justify-between items-center">
            <img src="/plantswatch.svg" alt="logo" />
            <a href="#" className="bg-white text-md text-font px-4 py-2">
              Get in Touch <ArrowForwardIcon />
            </a>
          </nav>
          <div className="text-center">
            <h1 className="font-semibold text-white tracking-wider text-9xl uppercase mb-5 trackingAnimation">
              Plants watch
            </h1>
            <button
              className="font-extralight text-white text-4xl capitalize opacity-90 fadeIn"
              onClick={() => setOpen(true)}
            >
              add an Image
            </button>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style} className="rounded-lg grid justify-center">
                <select
                  className="form-select px-4 py-3 text-lg rounded-lg w-80 text-font mb-5"
                  onChange={plantHandler}
                >
                  <option value="default" hidden>
                    Choose the plant type
                  </option>
                  <option value="potato">Potato</option>
                  <option value="pepper">Pepper</option>
                </select>
                {image && (
                  <>
                    <CardMedia
                      className="w-80 h-80 rounded-lg"
                      image={preview}
                      component="image"
                      onMouseEnter={() => setEnter(true)}
                      onMouseLeave={() => setEnter(false)}
                    >
                      <div
                        className={
                          enter
                            ? "w-full h-full bg-black/25 rounded-lg grid place-items-center"
                            : "hidden"
                        }
                      >
                        <button onClick={clearData}>
                          <ClearIcon
                            className="text-white"
                            style={{ fontSize: 75 }}
                          />
                        </button>
                      </div>
                    </CardMedia>
                    <a
                      onClick={handleClose}
                      className="bg-font text-center text-md text-white px-4 py-2 mt-5"
                    >
                      {" "}
                      Check the predictions <ArrowForwardIcon />
                    </a>
                  </>
                )}
                {!image && (
                  <DropzoneArea
                    className="text-font"
                    acceptedFiles={["image/*"]}
                    dropzoneText={"Drag and drop the image here"}
                    onChange={onSelectFile}
                  />
                )}
              </Box>
            </Modal>
          </div>
          <a href="#predictions">
            <img src="/scroll_down.svg" alt="scroll down" />
          </a>
        </div>
      </div>
      {data && (
        <div
          id="predictions"
          ref={predictions}
          className="grid justify-items-center w-full px-20 py-10"
        >
          <div className="flex item-center justify-center self-center gap-x-20">
            <div>
              <div>
                <CardMedia
                  className="w-96 h-96 rounded-lg"
                  image={preview}
                  component="image"
                ></CardMedia>
              </div>
            </div>
            <div>
              <div className="flex gap-x-20 mb-5">
                <div id="prediction">
                  <h3 className="font-semibold text-2xl">Predication:</h3>
                  <p className="text-lg">{data.class}</p>
                </div>
                <div id="confidence">
                  <h3 className="font-semibold text-2xl">Confidence:</h3>
                  <p className="text-lg">{confidence}%</p>
                </div>
              </div>
              <h3 className="font-semibold text-2xl">Description:</h3>
              <p className="text-lg mb-5">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Mollitia perspiciatis eaque neque aspernatur impedit aliquam
                doloremque, ipsum quo! Culpa quidem at ex quibusdam! Optio
                blanditiis deserunt voluptas sit obcaecati quaerat?
              </p>
              <h3 className="font-semibold text-2xl">Advice:</h3>
              <p className="text-lg">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Mollitia perspiciatis eaque neque aspernatur impedit aliquam
                doloremque, ipsum quo! Culpa quidem at ex quibusdam! Optio
                blanditiis deserunt voluptas sit obcaecati quaerat?
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
