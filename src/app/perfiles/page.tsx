
'use client';
import { Button } from '@/components/ui/button';
import { escorts } from '@/lib/data';
import { EscortProfileCard } from '@/components/escort-profile-card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, MapPin, ListFilter, Star, Menu, Crown } from "lucide-react";
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import React, { useState } from 'react';
import Link from 'next/link';

const categories = ["negras", "milf", "mamas solteras", "trans", "gordas"];

export default function ProfilesPage() {
  const [ageRange, setAgeRange] = useState([18, 60]);

  return (
    <>
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-bold font-headline text-primary">VENGA MOR</h1>
        <div className="flex items-center space-x-2">
          <Link href="/suscripcion">
            <Button variant="ghost" size="icon">
              <Crown className="h-8 w-8 text-yellow-400" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon">
              <Menu className="h-8 w-8 text-white" />
          </Button>
        </div>
      </header>

      <Card className="mb-6 bg-transparent border-0 text-center">
        <CardContent className="p-0">
            <p className="text-lg text-white/90">
                Bienvenido a Venga Mor, tu espacio exclusivo para conectar con acompañantes de élite en un ambiente de total privacidad y discreción.
            </p>
        </CardContent>
      </Card>

      <Card className="mb-6 bg-card/80 border-0">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="age-range" className="text-lg font-semibold text-accent mb-3 block">Rango de Edad: <span className="text-white">{ageRange[0]} - {ageRange[1]}</span></Label>
              <Slider
                id="age-range"
                min={18}
                max={60}
                step={1}
                value={ageRange}
                onValueChange={(value) => setAgeRange(value)}
                className="[&>span:first-child]:h-2 [&>span>span]:bg-primary"
              />
            </div>
            <div>
              <Label className="text-lg font-semibold text-accent mb-3 block">Categorías</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox id={category} className="border-primary data-[state=checked]:bg-primary"/>
                    <Label htmlFor={category} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize text-white">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Button variant="outline" className="bg-card border-primary text-white">
            <MapPin className="mr-2 h-4 w-4" /> Ciudad
        </Button>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-card border-primary text-white">
                    <Star className="mr-2 h-4 w-4" /> Calificación <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-card border-primary text-white">
                <DropdownMenuItem>Cualquiera</DropdownMenuItem>
                <DropdownMenuItem>5 Estrellas</DropdownMenuItem>
                <DropdownMenuItem>4+ Estrellas</DropdownMenuItem>
                <DropdownMenuItem>3+ Estrellas</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <section>
        <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto">
          {escorts.map(escort => (
            <EscortProfileCard key={escort.id} escort={escort} />
          ))}
        </div>
      </section>

      <div className="flex justify-center items-center space-x-2 mt-8">
        <Button variant="outline">Anterior</Button>
        <Button variant="default" className="w-10 h-10">1</Button>
        <Button variant="outline" className="w-10 h-10">2</Button>
        <Button variant="outline">Siguiente</Button>
      </div>

      <footer className="text-center py-6 border-t border-border/50 mt-12">
        <p className="text-muted-foreground">Bogotá, Colombia</p>
      </footer>
    </>
  );
}
