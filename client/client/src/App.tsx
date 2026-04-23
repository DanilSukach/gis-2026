import { useEffect, useRef } from 'react'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import OSM from 'ol/source/OSM'
import ImageLayer from 'ol/layer/Image'
import ImageWMS from 'ol/source/ImageWMS'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { fromLonLat } from 'ol/proj'
import { stylefunction } from 'ol-mapbox-style'

function App() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const overtureLayer = new VectorLayer({
      source: new VectorSource({
        url: '/overture.geojson',
        format: new GeoJSON()
      })
    })

    fetch('/overture-style.json')
      .then((r) => r.json())
      .then((style) => stylefunction(overtureLayer, style, 'overture'))

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        new ImageLayer({
          source: new ImageWMS({
            url: 'http://localhost:8080/geoserver/gis/wms',
            params: {
              LAYERS: 'gis:buildings',
              TILED: true
            },
            ratio: 1,
            serverType: 'geoserver'
          })
        }),
        new ImageLayer({
          source: new ImageWMS({
            url: 'http://localhost:8080/geoserver/gis/wms',
            params: {
              LAYERS: 'gis:roads',
              TILED: true
            },
            ratio: 1,
            serverType: 'geoserver'
          })
        }),
        new ImageLayer({
          source: new ImageWMS({
            url: 'http://localhost:8080/geoserver/gis/wms',
            params: {
              LAYERS: 'gis:poi',
              TILED: true
            },
            ratio: 1,
            serverType: 'geoserver'
          })
        }),
        overtureLayer
      ],
      view: new View({
        center: fromLonLat([50.336, 53.515]),
        zoom: 15
      })
    })

    return () => map.setTarget(undefined)
  }, [])

  return (
    <>
      <div
        id="map"
        ref={mapRef}
        style={{ width: '100%', height: '100vh' }}
      />
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: 'rgba(255,255,255,0.9)',
          padding: '8px 12px',
          borderRadius: 6,
          fontFamily: 'sans-serif',
          fontSize: 13,
          boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Overture source_type</div>
        <LegendRow color="#2ecc71" label="my" />
        <LegendRow color="#3498db" label="osm" />
        <LegendRow color="#e67e22" label="ml" />
      </div>
    </>
  )
}

function LegendRow({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
      <span
        style={{
          display: 'inline-block',
          width: 14,
          height: 14,
          background: color,
          border: '1px solid #222'
        }}
      />
      <span>{label}</span>
    </div>
  )
}

export default App
