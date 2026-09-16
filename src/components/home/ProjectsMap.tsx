import { useEffect, useState, useMemo } from 'react'
import { Box, Button, Paper, SxProps, Theme } from '@mui/material'
import { MapContainer, TileLayer, Marker, Polygon, Tooltip, useMap } from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getProjects } from '../../lib/api-client'
import { filterMapEligibleProjects, resolveMapCentroid, projectHasMapGeometry } from '../../lib/projectMap'
import CloudastickMapFootnote from '../map/CloudastickMapFootnote'
import { OSM_TILE_URL } from '../../lib/osmTiles'
import type { Project } from '../../lib/types'

const EGYPT_CENTER: LatLngExpression = [26.8, 30.8]

type ProjectWithAvailability = Project & {
  hasAvailability?: boolean
  availablePhasesCount?: number
  renderLat?: number
  renderLng?: number
}

type GeoJsonPolygon = {
  type: 'Polygon'
  coordinates: number[][][]
}

type GeoJsonMultiPolygon = {
  type: 'MultiPolygon'
  coordinates: number[][][][]
}

function isPolygon(g: unknown): g is GeoJsonPolygon {
  return !!g && typeof g === 'object' && (g as unknown as Record<string, unknown>).type === 'Polygon' && Array.isArray((g as unknown as Record<string, unknown>).coordinates)
}

function isMultiPolygon(g: unknown): g is GeoJsonMultiPolygon {
  return !!g && typeof g === 'object' && (g as unknown as Record<string, unknown>).type === 'MultiPolygon' && Array.isArray((g as unknown as Record<string, unknown>).coordinates)
}

function ringToLatLngs(ring: number[][]): LatLngExpression[] {
  return ring.map(([lng, lat]) => [lat, lng])
}

function createMapPinIcon(fill: string) {
  return L.divIcon({
    className: 'project-map-pin',
    html: `
      <div style="display:flex;justify-content:center;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.28));">
        <svg width="28" height="36" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 12 16 24 16 24s16-12 16-24C32 7.163 24.837 0 16 0z" fill="${fill}" stroke="rgba(255,255,255,0.9)" stroke-width="1.4"/>
          <circle cx="16" cy="15" r="4.5" fill="white" fill-opacity="0.95"/>
        </svg>
      </div>
    `,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    tooltipAnchor: [0, -32],
  })
}

const defaultPinIcon = createMapPinIcon('#1a1a1a')
const highlightedPinIcon = createMapPinIcon('#000000')
const soldOutPinIcon = createMapPinIcon('#7a7a7a')

function getProjectPinIcon(project: ProjectWithAvailability, isHighlighted: boolean) {
  if (isHighlighted) return highlightedPinIcon
  const isSoldOut = !project.hasAvailability && (project.availablePhasesCount ?? 0) === 0
  return isSoldOut ? soldOutPinIcon : defaultPinIcon
}

function MapController({
  selectedRegion,
  projects,
  resetTrigger,
  highlightedProjectId,
}: {
  selectedRegion: string | null
  projects: ProjectWithAvailability[]
  resetTrigger: number
  highlightedProjectId?: string | null
}) {
  const map = useMap()

  useEffect(() => {
    if (!projects.length) return

    if (highlightedProjectId) {
      const hp = projects.find((p) => p.id === highlightedProjectId)
      const pts: [number, number][] = []
      if (hp) {
        const lat = typeof hp.renderLat === 'number' ? hp.renderLat : hp.mapCentroidLat
        const lng = typeof hp.renderLng === 'number' ? hp.renderLng : hp.mapCentroidLng
        if (typeof lat === 'number' && typeof lng === 'number') pts.push([lat, lng])
        if (isPolygon(hp.mapGeometryJson)) {
          hp.mapGeometryJson.coordinates.forEach((ring) => ring.forEach(([lng, lat]) => pts.push([lat, lng])))
        } else if (isMultiPolygon(hp.mapGeometryJson)) {
          hp.mapGeometryJson.coordinates.forEach((poly) => poly.forEach((ring) => ring.forEach(([lng, lat]) => pts.push([lat, lng]))))
        }
      }
      if (pts.length > 1) {
        map.flyToBounds(L.latLngBounds(pts), { padding: [48, 48], duration: 1.6, maxZoom: 15 })
        return
      }
      if (pts.length === 1) {
        map.flyTo(pts[0], 13, { duration: 1.6, easeLinearity: 0.25 })
        return
      }
    }

    const targetProjects = selectedRegion
      ? projects.filter((p) => p.provinceRegion?.toLowerCase() === selectedRegion.toLowerCase())
      : projects

    const pts: [number, number][] = []
    targetProjects.forEach((p) => {
      if (typeof p.renderLat === 'number' && typeof p.renderLng === 'number') {
        pts.push([p.renderLat, p.renderLng])
      } else if (typeof p.mapCentroidLat === 'number' && typeof p.mapCentroidLng === 'number') {
        pts.push([p.mapCentroidLat, p.mapCentroidLng])
      }
      if (isPolygon(p.mapGeometryJson)) {
        p.mapGeometryJson.coordinates.forEach((ring) => {
          ring.forEach(([lng, lat]) => pts.push([lat, lng]))
        })
      } else if (isMultiPolygon(p.mapGeometryJson)) {
        p.mapGeometryJson.coordinates.forEach((poly) => {
          poly.forEach((ring) => {
            ring.forEach(([lng, lat]) => pts.push([lat, lng]))
          })
        })
      }
    })

    if (pts.length > 0) {
      map.flyToBounds(L.latLngBounds(pts), { padding: [48, 48], duration: 1.2, maxZoom: 10 })
    } else if (!selectedRegion) {
      map.flyTo(EGYPT_CENTER, 6, { duration: 1.2 })
    }
  }, [selectedRegion, projects, resetTrigger, map, highlightedProjectId])

  return null
}

function MapResizeInvalidate() {
  const map = useMap()

  useEffect(() => {
    const run = () => map.invalidateSize()
    const t1 = window.setTimeout(run, 0)
    const t2 = window.setTimeout(run, 200)
    window.addEventListener('resize', run)
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.removeEventListener('resize', run)
    }
  }, [map])

  return null
}

type ProjectsMapProps = {
  sx?: SxProps<Theme>
  highlightedProjectId?: string | null
  onProjectSelect?: (id: string | null) => void
  projects?: ProjectWithAvailability[]
}

export default function ProjectsMap({ sx, highlightedProjectId, onProjectSelect, projects: passedProjects }: ProjectsMapProps) {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const [fetchedProjects, setFetchedProjects] = useState<ProjectWithAvailability[]>([])
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [resetTrigger, setResetTrigger] = useState(0)

  useEffect(() => {
    if (passedProjects) return
    async function loadProjects() {
      try {
        const res = await getProjects({ forMap: true })
        if (res.success && res.data) {
          setFetchedProjects(res.data.filter(projectHasMapGeometry))
        }
      } catch (err) {
        console.error('Error loading projects map data:', err)
      }
    }
    loadProjects()
  }, [passedProjects])

  const projects = useMemo(
    () => filterMapEligibleProjects(passedProjects || fetchedProjects),
    [passedProjects, fetchedProjects]
  )
  const isRtl = i18n.language === 'ar'

  const regions = useMemo(() => {
    return Array.from(new Set(projects.map((p) => p.provinceRegion).filter((r): r is string => !!r)))
  }, [projects])

  const projectMarkers = useMemo(() => {
    return projects.flatMap((project) => {
      const centroid = resolveMapCentroid(project)
      if (!centroid) return []
      return [{
        ...project,
        renderLat: centroid.lat,
        renderLng: centroid.lng,
      }]
    })
  }, [projects])

  const getLocalizedRegionName = (rName: string) => {
    if (!rName) return ''
    const lower = rName.toLowerCase()

    if (isRtl) {
      if (lower.includes('cairo') || lower.includes('القاهرة')) return 'القاهرة'
      if (lower.includes('giza') || lower.includes('الجيزة')) return 'الجيزة'
      if (lower.includes('matrouh') || lower.includes('مطروح')) return 'مطروح'
      const lines = rName.split(/[\r\n]+/)
      const arabicLine = lines.find((l) => /[\u0600-\u06FF]/.test(l))
      if (arabicLine) return arabicLine.replace(/^-?\s*/, '').trim()
      return rName
    }

    if (lower.includes('cairo') || lower.includes('القاهرة')) return 'Cairo'
    if (lower.includes('giza') || lower.includes('الجيزة')) return 'Giza'
    if (lower.includes('matrouh') || lower.includes('مطروح')) return 'Matrouh'
    const lines = rName.split(/[\r\n]+/)
    const englishLine = lines.find((l) => /[a-zA-Z]/.test(l))
    if (englishLine) return englishLine.replace(/^-?\s*/, '').trim()
    return rName
  }

  const allPolygons = useMemo(() => {
    const list: { id: string; rings: LatLngExpression[][]; isSelected: boolean; isHighlighted: boolean }[] = []
    projects.forEach((p) => {
      const isSelected = selectedRegion
        ? p.provinceRegion?.toLowerCase() === selectedRegion.toLowerCase()
        : true
      const isHighlighted = p.id === highlightedProjectId

      if (isPolygon(p.mapGeometryJson)) {
        list.push({ id: p.id, rings: p.mapGeometryJson.coordinates.map(ringToLatLngs), isSelected, isHighlighted })
      } else if (isMultiPolygon(p.mapGeometryJson)) {
        p.mapGeometryJson.coordinates.forEach((poly) => {
          list.push({ id: p.id, rings: poly.map(ringToLatLngs), isSelected, isHighlighted })
        })
      }
    })
    return list
  }, [projects, selectedRegion, highlightedProjectId])

  const displayedProjects = useMemo(() => {
    if (!selectedRegion) return projectMarkers
    return projectMarkers.filter((p) => p.provinceRegion?.toLowerCase() === selectedRegion.toLowerCase())
  }, [projectMarkers, selectedRegion])

  return (
    <Paper
      elevation={4}
      className="projects-map-monochrome"
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: { xs: 360, sm: 420, md: 560 },
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.08)',
        ...sx,
      }}
    >
      <MapContainer
        center={EGYPT_CENTER}
        zoom={6}
        style={{ width: '100%', height: '100%', background: '#e8e8e8' }}
        scrollWheelZoom
        attributionControl={false}
      >
        <TileLayer attribution="" url={OSM_TILE_URL} />

        <MapResizeInvalidate />
        <MapController
          selectedRegion={selectedRegion}
          projects={projectMarkers}
          resetTrigger={resetTrigger}
          highlightedProjectId={highlightedProjectId}
        />

        {allPolygons.map((item, idx) =>
          item.rings.map((ring, rIdx) => (
            <Polygon
              key={`${idx}-${rIdx}`}
              positions={ring}
              pathOptions={{
                color: item.isHighlighted ? '#111111' : '#3a3a3a',
                weight: item.isHighlighted ? 3.2 : (item.isSelected ? 2 : 1.2),
                dashArray: item.isHighlighted ? undefined : '4, 6',
                fillColor: item.isHighlighted ? '#111111' : '#2a2a2a',
                fillOpacity: item.isHighlighted ? 0.38 : (item.isSelected ? 0.2 : 0.08),
              }}
            />
          ))
        )}

        {displayedProjects.map((project) => {
          const isHighlighted = highlightedProjectId === project.id
          const isSoldOut = !project.hasAvailability && (project.availablePhasesCount ?? 0) === 0
          const projectName = isRtl ? project.nameAr : project.name
          const statusLabel = isSoldOut
            ? isRtl ? 'مباع بالكامل' : 'Sold Out'
            : isRtl ? 'استكشف' : 'Explore'

          return (
            <Marker
              key={project.id}
              position={[project.renderLat, project.renderLng]}
              icon={getProjectPinIcon(project, isHighlighted)}
              eventHandlers={{
                click: () => {
                  if (highlightedProjectId === project.id) {
                    navigate(`/project/${project.id}`)
                  } else {
                    onProjectSelect?.(project.id)
                  }
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -32]} opacity={0.95}>
                <span style={{ fontWeight: 600 }}>{projectName}</span>
                <br />
                <span style={{ fontSize: 11, opacity: 0.85 }}>{statusLabel}</span>
              </Tooltip>
            </Marker>
          )
        })}
      </MapContainer>

      <CloudastickMapFootnote />

      <Box
        sx={{
          position: 'absolute',
          bottom: 24,
          left: 24,
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          onClick={() => {
            setSelectedRegion(null)
            setResetTrigger((prev) => prev + 1)
          }}
          sx={{
            bgcolor: '#111',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'none',
            px: 2,
            py: 1,
            borderRadius: 1,
            boxShadow: 4,
            '&:hover': {
              bgcolor: '#2a2a2a',
            },
          }}
        >
          {isRtl ? 'إعادة ضبط الخريطة' : 'Reset Zoom'}
        </Button>
      </Box>

      {regions.length > 0 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1,
            width: 'calc(100% - 32px)',
            maxWidth: '100%',
            bgcolor: 'rgba(17, 17, 17, 0.92)',
            p: 0.75,
            borderRadius: 2,
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {regions.map((regionName) => {
            const isSelected = selectedRegion?.toLowerCase() === regionName.toLowerCase()
            return (
              <Button
                key={regionName}
                onClick={() => setSelectedRegion(regionName)}
                sx={{
                  color: '#fff',
                  fontWeight: isSelected ? 700 : 400,
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  px: 2,
                  py: 0.75,
                  borderRadius: 1.5,
                  transition: 'all 0.2s',
                  opacity: isSelected ? 1 : 0.55,
                  borderBottom: isSelected ? '2px solid rgba(255,255,255,0.9)' : '2px solid transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.08)',
                  },
                }}
              >
                {getLocalizedRegionName(regionName)}
              </Button>
            )
          })}
        </Box>
      )}
    </Paper>
  )
}
