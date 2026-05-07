"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"

const STORAGE_KEY = "favorite-buses"

const Favorites = () => {
  const [favorites, setFavorites] = useState([])
  const [newBusId, setNewBusId] = useState("")

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
      setFavorites(Array.isArray(saved) ? saved : [])
    } catch {
      setFavorites([])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const addFavorite = () => {
    const trimmed = newBusId.trim()
    if (!trimmed) return
    if (favorites.includes(trimmed)) return
    setFavorites([trimmed, ...favorites])
    setNewBusId("")
  }

  const removeFavorite = (id) => {
    setFavorites(favorites.filter((f) => f !== id))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="flex-1 w-full">
              <Input
                value={newBusId}
                onChange={(e) => setNewBusId(e.target.value)}
                placeholder="Add a bus by ID (e.g., 215A, ST6, DN47)"
              />
            </div>
            <Button onClick={addFavorite}>Add to Favorites</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {favorites.length === 0 ? (
            <p className="text-sm text-muted-foreground">No favorites yet. Add your frequently tracked buses.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {favorites.map((id) => (
                <div key={id} className="border rounded-lg p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-lg font-semibold">{id}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Quick Track</Badge>
                      <Badge variant="success">Subscribed</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(id)}>Copy</Button>
                    <Button variant="destructive" size="sm" onClick={() => removeFavorite(id)}>Remove</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Favorites


