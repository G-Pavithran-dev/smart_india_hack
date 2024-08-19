import React, { useState } from "react";

const JourneyDetails = () => {
  const [journeyType, setJourneyType] = useState("");
  const [pnrNo, setPnrNo] = useState("");
  const [utsNo, setUtsNo] = useState("");
  const [trainNo, setTrainNo] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [fileview, setFileview] = useState(null);

  const handleJourneyTypeChange = (event) => {
    setJourneyType(event.target.value);
    setPnrNo("");
    setUtsNo("");
    setTrainNo("");
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type === "image/png" || selectedFile.type === "image/jpeg")
    ) {
      setFile(selectedFile);
      setFileview(URL.createObjectURL(selectedFile));
    } else {
      alert("Please upload a file in PNG or JPG format.");
      event.target.value = null;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({
      journeyType,
      pnrNo,
      utsNo,
      trainNo,
      description,
      file,
    });
  };

  return (
    <form
      className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg my-10 border border-red-600"
      onSubmit={handleSubmit}
    >
      <div className="">
        <label
          htmlFor="journeyType"
          className="block text-gray-700 font-bold mb-2 text-left"
        >
          Journey Details:
        </label>
        <select
          id="journeyType"
          value={journeyType}
          onChange={handleJourneyTypeChange}
          required
          className="block w-full border border-gray-300 rounded-md p-2 text-left"
        >
          <option value="" disabled>
            Select Journey Type
          </option>
          <option value="PNR">PNR</option>
          <option value="UTS">UTS</option>
        </select>
      </div>

      {journeyType === "PNR" && (
        <div className="mb-4">
          <label htmlFor="pnrNo" className="block text-gray-700 font-bold mb-2 text-left">
            PNR Number:
          </label>
          <input
            type="text"
            id="pnrNo"
            value={pnrNo}
            onChange={(e) => setPnrNo(e.target.value)}
            required
            className="block w-full border border-gray-300 rounded-md p-2 text-left"
          />
        </div>
      )}

      {journeyType === "UTS" && (
        <>
          <div className="mb-4">
            <label
              htmlFor="utsNo"
              className="block text-gray-700 font-bold mb-2 text-left"
            >
              UTS Number:
            </label>
            <input
              type="text"
              id="utsNo"
              value={utsNo}
              onChange={(e) => setUtsNo(e.target.value)}
              required
              className="block w-full border border-gray-300 rounded-md p-2 text-left"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="trainNo"
              className="block text-gray-700 font-bold mb-2 text-left"
            >
              Train Number:
            </label>
            <input
              type="text"
              id="trainNo"
              value={trainNo}
              onChange={(e) => setTrainNo(e.target.value)}
              required
              className="block w-full border border-gray-300 rounded-md p-2 text-left"
            />
          </div>
        </>
      )}

      <div className="mb-4">
        <label
          htmlFor="fileUpload"
          className="block text-gray-700 font-bold mb-2 text-left"
        >
          Upload File:
        </label>
        <input
          type="file"
          id="fileUpload"
          accept=".png, .jpg, .jpeg"
          onChange={handleFileChange}
          required
          className="block w-full text-gray-700 p-2 border border-gray-300 rounded-md"
        />
      </div>

      {fileview && (
        <div className="mb-4">
          <img
            src={fileview}
            alt="File view"
            className="w-32 h-32 object-cover border border-gray-300 rounded-md"
          />
        </div>
      )}

      <div className="mb-4">
        <label
          htmlFor="description"
          className="block text-gray-700 font-bold mb-2 text-left"
        >
          Description:
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="4"
          required
          className="block w-full border border-gray-300 rounded-md p-2 text-left"
        />
        <button type="button" className="rounded-md border border-gray-300 my-2 p-1 hover:bg-blue-200">Fill with AI</button>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-black text-white font-bold py-2 px-4 rounded hover:bg-gray-800 transition duration-300"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default JourneyDetails;
