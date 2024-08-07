import React, { useState, useRef } from "react";
import "../styles/uploader.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdCloudUpload, MdDelete } from "react-icons/md";
import { AiFillFileImage } from "react-icons/ai";

function Uploader() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("no selected file");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        await axios.post("http://localhost:8080/v1/assets/import", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        navigate("/assetslist");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleDelete = () => {
    setFile(null);
    setFileName("no selected file");
  };

  return (
    <div className="main-cn">
      <form action="" className="upload-box" onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: "none" }}
          id="file-upload"
          name="file"
        />
        {image ? (
          <img
            src={image}
            width={60}
            height={60}
            alt={fileName}
            onClick={handleImageClick}
          />
        ) : (
          <div onClick={handleImageClick}>
            <MdCloudUpload color="#1475cf" size={120} />
            <p>Browse files to upload</p>
          </div>
        )}
        <button type="submit" className="btn btn-success">
          Submit
        </button>
      </form>
      <section className="file-desc">
        <AiFillFileImage color="black" />
        <span>
          {fileName}
          {file && <MdDelete onClick={handleDelete} />}
        </span>
      </section>
    </div>
  );
}

export default Uploader;



// import React, { useState, useRef } from "react";
// import PropTypes from "prop-types";
// import "../styles/uploader.css";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { MdCloudUpload, MdDelete } from "react-icons/md";
// import { AiFillFileImage } from "react-icons/ai";

// function Uploader({props}) {
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);
//   const [file, setFile] = useState(null);
//   const [image, setImage] = useState(null);
//   const [fileName, setFileName] = useState("no selected file");

//   const apiEndpoint = props.apiEndpoint;


//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     setFile(selectedFile);
//     setFileName(selectedFile.name);
//   };

//   const handleImageClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     console.log(apiEndpoint);
//     console.log(file);
//     console.log(typeof apiEndpoint);
//     if (file && apiEndpoint && typeof apiEndpoint === "string") {
//       console.log("yes");
//       const formData = new FormData();
//       formData.append("file", file);
  
//       try {
//         await axios.post(apiEndpoint, formData, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         });
  
//         navigate("/assetslist");
//       } catch (error) {
//         console.log(error);
//       }
//     } else {
//       console.log("Invalid API endpoint");
//     }
//   };

//   const handleDelete = () => {
//     setFile(null);
//     setFileName("no selected file");
//   };

//   return (
//     <div className="main-cn">
//       <form action="" className="upload-box" onSubmit={handleSubmit}>
//         <input
//           type="file"
//           accept=".csv"
//           onChange={handleFileChange}
//           ref={fileInputRef}
//           style={{ display: "none" }}
//           id="file-upload"
//           name="file"
//         />
//         {image ? (
//           <img
//             src={image}
//             width={60}
//             height={60}
//             alt={fileName}
//             onClick={handleImageClick}
//           />
//         ) : (
//           <div onClick={handleImageClick}>
//             <MdCloudUpload color="#1475cf" size={120} />
//             <p>Browse files to upload</p>
//           </div>
//         )}
//         <button type="submit" className="btn btn-success">
//           Submit
//         </button>
//       </form>
//       <section className="file-desc">
//         <AiFillFileImage color="black" />
//         <span>
//           {fileName}
//           {file && <MdDelete onClick={handleDelete} />}
//         </span>
//       </section>
//     </div>
//   );
// }


// export default Uploader;
