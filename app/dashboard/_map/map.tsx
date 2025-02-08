import {
  APIProvider,
  InfoWindow,
  Map,
  Marker,
  useMarkerRef,
} from "@vis.gl/react-google-maps";
import { useEffect, useState, useCallback } from "react";
import { LoadingSpinner } from "@/components/spinner/spinner";

type MarkerType = {
  location: string | null;
  id: string;
  name: string;
  note: string | null;
  coord: string | null;
  date: Date | null;
  authorId: string | null;
};

type CustomMapProps = {
  onMarkerClick: (marker: MarkerType) => void;
};

const CustomMap = ({ onMarkerClick }: CustomMapProps) => {
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [loading, setLoading] = useState(true);
  // `markerRef` and `marker` are needed to establish the connection between
  // the marker and infowindow
  const [markerRef, onHoverMarker] = useMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const center = {
    lat: -27.41967,
    lng: 153.0473996,
  };

  const defaultStyle = {
    width: "40vw",
    height: "80vh",
    borderRadius: "20px",
    overflow: "hidden",
  };

  const defaultMapZoom = 9;

  useEffect(() => {
    const fetchMarkers = async () => {
      const res = await fetch("/api/marker");
      const data = await res.json();
      setMarkers(data);
      setLoading(false);
    };

    fetchMarkers();
  }, []);

  const handleMarkerHover = useCallback(
    () => setInfoWindowShown((isShown) => !isShown),
    []
  );

  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner />
        </div>
      ) : (
        <Map
          mapId={process.env.NEXT_PUBLIC_MAPS_ID as string}
          style={defaultStyle}
          defaultCenter={center}
          defaultZoom={defaultMapZoom}
          gestureHandling={"greedy"}
          disableDefaultUI={false}
          streetViewControl={false}
        >
          {markers.map((marker, i) => {
            if (!marker.coord) {
              return null;
            }

            const [lat, lng] = marker.coord.split(",").map(Number);

            return (
              <>
                <Marker
                  ref={markerRef}
                  key={i}
                  position={{ lat, lng }}
                  icon={{
                    url: "/tree-marker.svg",
                    scale: 0.075,
                  }}
                  onClick={() => onMarkerClick(marker)}
                  onMouseOver={handleMarkerHover}
                />

                {infoWindowShown && (
                  <InfoWindow
                    className="flex flex-row"
                    anchor={onHoverMarker}
                    onCloseClick={handleClose}
                    minWidth={50}
                  >
                    <h5 className="text-black">
                      Click to view map marker details
                    </h5>
                  </InfoWindow>
                )}
              </>
            );
          })}
        </Map>
      )}
    </APIProvider>
  );
};

export default CustomMap;
