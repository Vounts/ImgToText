import "./App.css";
import { useEffect, useState } from "react";
import Tesseract from "tesseract.js";

function App() {
  const [image, setImage] = useState("");

  const setPreviewImage = async (file) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      document.querySelector("#imagePreview").src = fileReader.result;

      document.getElementById("imagePreview").style.display = "flex";
      setImage(fileReader.result);
    };
  };

  const readImage = (images) => {
    if (images == null) {
      return;
    }

    document.getElementById("loader-wrapper").style.display = "flex";
    Tesseract.recognize(images, "eng", { logger: (m) => console.log(m) })
      .then(({ data: { text } }) => {
        document.getElementById("loader-wrapper").style.display = "none";
        document.getElementById("TitleText").innerHTML = "Conversion Success!";
        console.log(text);
        document.getElementById("myTextarea").value = text;
      })
      .catch((err) => {
        document.getElementById("myTextarea").value = err;
      });
  };

  useEffect(() => {
    window.addEventListener("paste", (e) => {
      e.preventDefault();
      if (e.clipboardData.files.length > 0) {
        const fileInput = document.querySelector("#myFile");
        fileInput.files = e.clipboardData.files;

        if (e.clipboardData.files[0].type.startsWith("image/")) {
          setPreviewImage(e.clipboardData.files[0]);
        }
      }
    });

    window.addEventListener("keydown", (e) => {
      if (e.key === "F5") {
        window.location.reload(false);
      }
    });
  }, []);

  return (
    <div className="App">
      <div class="loader-wrapper" id="loader-wrapper">
        <span class="loader">
          <span class="loader-inner"></span>
        </span>
      </div>

      <header className="App-header">
        <label className="myFile" id="TitleText">
          Paste your image
        </label>
        <input type="file" name="myFile" id="myFile"></input>
        <button onClick={() => readImage(image)} className="button">
          Convert
        </button>

        <img alt="Preview" id="imagePreview" className="imageTest"></img>
        <textarea className="textNow" id="myTextarea"></textarea>
      </header>
    </div>
  );
}

export default App;
