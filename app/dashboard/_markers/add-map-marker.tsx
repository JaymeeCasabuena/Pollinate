import Image from "next/image";
import Rock from "../../../public/IvyRock.webp";
import Ivy from "../../../public/Ivy.webp";
import { APIProvider } from "@vis.gl/react-google-maps";
import FileUploadForm from "../_file-upload/upload";
import { AddressAutoComplete } from "../_map/address-autocomplete";
import { useActionState } from "react";
import { addMarker } from "@/app/actions/add-marker-actions";
import Alert from "@/components/alert";
import "../../../styles/dashboard.css";

const AddMarkerForm = () => {
  const [state, action, pending] = useActionState(addMarker, undefined);

  return (
    <div className="form flex flex-col items-center justify-center h-54 py-10">
      <form
        action={action}
        className="flex flex-col relative w-full max-w-lg rounded-2xl drop-shadow-xl p-6"
      >
        {state?.errors?.name && <Alert>{state.errors.name}</Alert>}
        {state?.errors?.location && <Alert>{state.errors.location}</Alert>}
        {state?.errors?.date && <Alert>{state.errors.date}</Alert>}
        {state?.errors?.note && <Alert>{state.errors.note}</Alert>}
        <h1 className="text-2xl font-bold p-2 mb-5">Add a new map marker</h1>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full text-gray-400 p-3 mb-3 border rounded shadow-lg z-10"
        />
        <div className="mt-2 z-10">
          <APIProvider
            apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
          >
            <AddressAutoComplete />
          </APIProvider>
        </div>
        <input
          className="w-full text-gray-400 p-3 mb-3 border shadow-lg rounded"
          name="date"
          type="date"
          placeholder="Date"
        />
        <textarea
          name="note"
          placeholder="Write notes here"
          className="w-full text-gray-400 p-3 mb-3 border shadow-lg rounded"
        />
        <FileUploadForm></FileUploadForm>
        <button
          type="submit"
          className="self-end px-8 py-3 mt-5 rounded-full font-semibold text-black"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddMarkerForm;
