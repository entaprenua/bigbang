import { createContext, useContext, createResource, Show, splitProps, type JSX } from "solid-js"
import { APIProvider, Map as GoogleMapsMap, Marker, InfoWindow } from "solid-google-maps"
import { getConfig } from "~/lib/config"

type MapContextValue = {
  center: { lat: number; lng: number }
}

const MapContext = createContext<MapContextValue>()

const useMapContext = () => useContext(MapContext)

type GoogleMapProps = {
  apiKey?: string
  center?: { lat: number; lng: number }
  zoom?: number
  mapId?: string
  class?: string
  style?: JSX.CSSProperties
  children?: JSX.Element
}

export const GoogleMap = (allProps: GoogleMapProps) => {
  const [local, others] = splitProps(allProps, [
    "apiKey", "center", "zoom", "mapId", "class", "style", "children",
  ])
  const [cfg] = createResource(getConfig)

  const apiKey = () => local.apiKey ?? (cfg()?.google_maps_api_key as string | undefined)
  const lat = () => local.center?.lat ?? (cfg()?.google_maps_latitude as number | undefined)
  const lng = () => local.center?.lng ?? (cfg()?.google_maps_longitude as number | undefined)
  const enabled = () => cfg()?.google_maps_enabled !== false
  const resolvedCenter = () => (lat() != null && lng() != null) ? { lat: lat()!, lng: lng()! } : undefined
  const ready = () => enabled() && apiKey() && resolvedCenter()

  return (
    <Show when={ready()}>
      <MapContext.Provider value={{ center: resolvedCenter()! }}>
        <APIProvider apiKey={apiKey()!}>
          <GoogleMapsMap
            center={resolvedCenter()!}
            zoom={local.zoom ?? 15}
            mapId={local.mapId}
            class={local.class}
            style={local.style}
            {...others}
          >
            {local.children}
          </GoogleMapsMap>
        </APIProvider>
      </MapContext.Provider>
    </Show>
  )
}

export const GoogleMapMarker = (props: Record<string, unknown>) => {
  const ctx = useMapContext()
  const position = ctx?.center

  return (
    <Show when={position}>
      <Marker position={position} {...props} />
    </Show>
  )
}

export const GoogleMapInfoWindow = (props: { children?: JSX.Element;[key: string]: unknown }) => {
  const ctx = useMapContext()
  const center = ctx?.center
  const [local, others] = splitProps(props as Record<string, unknown>, ["children", "position"])

  return (
    <Show when={center && props.children}>
      <InfoWindow
        position={(local.position ?? center) as google.maps.LatLngLiteral}
        open={true}
        {...others}
      >
        {props.children}
      </InfoWindow>
    </Show>
  )
}
