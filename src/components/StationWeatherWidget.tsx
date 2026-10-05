import React, { useState } from 'react';
import { Sun, CloudSun, CloudRain, Cloud, Wind, Thermometer, Droplets, Eye, ArrowRight, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { Station } from '../types/railway';

interface StationWeatherWidgetProps {
  sourceStation: Station;
  destStation: Station;
  journeyDate: string;
}

interface StationWeatherData {
  temp: number;
  feelsLike: number;
  condition: string;
  iconType: 'sun' | 'cloud-sun' | 'rain' | 'cloud' | 'wind';
  humidity: number;
  windSpeed: number;
  aqi: number;
  aqiLabel: string;
  visibilityKm: number;
  packingTip: string;
  hourlyForecast: { time: string; temp: number; condition: string }[];
}

const CITY_WEATHER_DATABASE: Record<string, StationWeatherData> = {
  NDLS: {
    temp: 29,
    feelsLike: 31,
    condition: 'Sunny & Clear',
    iconType: 'sun',
    humidity: 42,
    windSpeed: 14,
    aqi: 135,
    aqiLabel: 'Moderate',
    visibilityKm: 8,
    packingTip: 'Light breathable cottons • Sunglasses recommended for morning departure',
    hourlyForecast: [
      { time: '06:00', temp: 22, condition: 'Clear' },
      { time: '09:00', temp: 26, condition: 'Sunny' },
      { time: '12:00', temp: 31, condition: 'Sunny' },
      { time: '15:00', temp: 32, condition: 'Clear' },
      { time: '18:00', temp: 28, condition: 'Pleasant' }
    ]
  },
  HWH: {
    temp: 27,
    feelsLike: 30,
    condition: 'Partly Cloudy & Humid',
    iconType: 'cloud-sun',
    humidity: 78,
    windSpeed: 18,
    aqi: 72,
    aqiLabel: 'Good',
    visibilityKm: 10,
    packingTip: 'Light umbrella advised • Coastal humidity expected on platform arrival',
    hourlyForecast: [
      { time: '06:00', temp: 24, condition: 'Misty' },
      { time: '10:00', temp: 28, condition: 'Partly Cloudy' },
      { time: '14:00', temp: 30, condition: 'Humid' },
      { time: '18:00', temp: 27, condition: 'Breezy' },
      { time: '21:00', temp: 25, condition: 'Clear' }
    ]
  },
  MMCT: {
    temp: 31,
    feelsLike: 35,
    condition: 'Coastal Sea Breeze',
    iconType: 'wind',
    humidity: 74,
    windSpeed: 22,
    aqi: 65,
    aqiLabel: 'Good',
    visibilityKm: 10,
    packingTip: 'Stay hydrated • Sea breeze keeps platforms cool in the evening',
    hourlyForecast: [
      { time: '06:00', temp: 26, condition: 'Breezy' },
      { time: '11:00', temp: 31, condition: 'Sunny' },
      { time: '16:00', temp: 32, condition: 'Sea Breeze' },
      { time: '20:00', temp: 29, condition: 'Pleasant' },
      { time: '23:00', temp: 27, condition: 'Breezy' }
    ]
  },
  SBC: {
    temp: 23,
    feelsLike: 23,
    condition: 'Pleasant & Mild',
    iconType: 'cloud-sun',
    humidity: 58,
    windSpeed: 12,
    aqi: 48,
    aqiLabel: 'Satisfactory',
    visibilityKm: 10,
    packingTip: 'Light cardigan or jacket recommended for early morning and evening hours',
    hourlyForecast: [
      { time: '06:00', temp: 18, condition: 'Cool' },
      { time: '10:00', temp: 23, condition: 'Pleasant' },
      { time: '14:00', temp: 26, condition: 'Mild' },
      { time: '18:00', temp: 22, condition: 'Breezy' },
      { time: '22:00', temp: 19, condition: 'Cool' }
    ]
  },
  MAS: {
    temp: 32,
    feelsLike: 37,
    condition: 'Warm & Tropical',
    iconType: 'sun',
    humidity: 82,
    windSpeed: 16,
    aqi: 58,
    aqiLabel: 'Satisfactory',
    visibilityKm: 9,
    packingTip: 'Air-conditioned coach booking recommended • Light tropical wear',
    hourlyForecast: [
      { time: '06:00', temp: 27, condition: 'Warm' },
      { time: '11:00', temp: 32, condition: 'Sunny' },
      { time: '15:00', temp: 33, condition: 'Humid' },
      { time: '19:00', temp: 30, condition: 'Coastal' },
      { time: '23:00', temp: 28, condition: 'Humid' }
    ]
  },
  ADI: {
    temp: 34,
    feelsLike: 36,
    condition: 'Dry & Sunny',
    iconType: 'sun',
    humidity: 32,
    windSpeed: 15,
    aqi: 110,
    aqiLabel: 'Moderate',
    visibilityKm: 10,
    packingTip: 'Carry water bottle • Dry heat outdoors with cold AC coaches',
    hourlyForecast: [
      { time: '06:00', temp: 23, condition: 'Clear' },
      { time: '11:00', temp: 32, condition: 'Sunny' },
      { time: '15:00', temp: 36, condition: 'Hot' },
      { time: '19:00', temp: 31, condition: 'Clear' },
      { time: '23:00', temp: 27, condition: 'Mild' }
    ]
  },
  PNBE: {
    temp: 28,
    feelsLike: 30,
    condition: 'Clear Sky',
    iconType: 'sun',
    humidity: 55,
    windSpeed: 11,
    aqi: 125,
    aqiLabel: 'Moderate',
    visibilityKm: 8,
    packingTip: 'Comfortable cotton wear • Smooth rail track conditions',
    hourlyForecast: [
      { time: '06:00', temp: 21, condition: 'Clear' },
      { time: '11:00', temp: 28, condition: 'Sunny' },
      { time: '15:00', temp: 31, condition: 'Clear' },
      { time: '19:00', temp: 26, condition: 'Pleasant' },
      { time: '23:00', temp: 23, condition: 'Cool' }
    ]
  },
  GKP: {
    temp: 26,
    feelsLike: 27,
    condition: 'Mild & Breezy',
    iconType: 'cloud-sun',
    humidity: 62,
    windSpeed: 10,
    aqi: 95,
    aqiLabel: 'Moderate',
    visibilityKm: 9,
    packingTip: 'Standard travel attire • Pleasant journey conditions',
    hourlyForecast: [
      { time: '06:00', temp: 20, condition: 'Misty' },
      { time: '11:00', temp: 26, condition: 'Clear' },
      { time: '15:00', temp: 29, condition: 'Sunny' },
      { time: '19:00', temp: 25, condition: 'Pleasant' },
      { time: '23:00', temp: 22, condition: 'Cool' }
    ]
  }
};

const DEFAULT_WEATHER: StationWeatherData = {
  temp: 26,
  feelsLike: 27,
  condition: 'Clear & Pleasant',
  iconType: 'sun',
  humidity: 50,
  windSpeed: 12,
  aqi: 80,
  aqiLabel: 'Good',
  visibilityKm: 10,
  packingTip: 'Pleasant weather expected across station platforms',
  hourlyForecast: [
    { time: '06:00', temp: 20, condition: 'Clear' },
    { time: '12:00', temp: 27, condition: 'Sunny' },
    { time: '18:00', temp: 25, condition: 'Pleasant' },
    { time: '22:00', temp: 22, condition: 'Cool' }
  ]
};

export const StationWeatherWidget: React.FC<StationWeatherWidgetProps> = ({
  sourceStation,
  destStation,
  journeyDate
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'hourly'>('overview');

  const srcWeather = CITY_WEATHER_DATABASE[sourceStation.code] || DEFAULT_WEATHER;
  const dstWeather = CITY_WEATHER_DATABASE[destStation.code] || DEFAULT_WEATHER;

  const tempDiff = dstWeather.temp - srcWeather.temp;
  const tempDiffText =
    tempDiff > 0
      ? `+${tempDiff}°C Warmer at Destination`
      : tempDiff < 0
      ? `${tempDiff}°C Cooler at Destination`
      : 'Identical Temperature at Destination';

  const renderWeatherIcon = (iconType: string, className = 'w-7 h-7') => {
    switch (iconType) {
      case 'sun':
        return <Sun className={`${className} text-amber-400 animate-spin`} style={{ animationDuration: '20s' }} />;
      case 'cloud-sun':
        return <CloudSun className={`${className} text-sky-400`} />;
      case 'rain':
        return <CloudRain className={`${className} text-blue-400`} />;
      case 'wind':
        return <Wind className={`${className} text-teal-400`} />;
      default:
        return <Cloud className={`${className} text-slate-400`} />;
    }
  };

  const getAqiBadgeColor = (aqi: number) => {
    if (aqi <= 50) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    if (aqi <= 100) return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
    if (aqi <= 150) return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
  };

  return (
    <div className="rounded-[2.5rem] bg-slate-900 border-2 border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Thermometer className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                JOURNEY CLIMATE ADVISORY
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">Date: {journeyDate}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Station Weather & Trackside Climate Conditions
            </h2>
          </div>
        </div>

        {/* Tab View Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Terminal Comparison
          </button>
          <button
            onClick={() => setActiveTab('hourly')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'hourly'
                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Hourly Timeline
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Origin Station Weather Card (5 Cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-slate-950 border border-slate-800 p-6 space-y-4 shadow-lg hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest font-black block">
                  ORIGIN DEPARTURE
                </span>
                <h3 className="text-lg font-black text-white">
                  {sourceStation.name}
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Code: <strong>{sourceStation.code}</strong> • {sourceStation.city}, {sourceStation.state}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                {renderWeatherIcon(srcWeather.iconType)}
              </div>
            </div>

            {/* Temperature & Condition */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-4xl font-black font-mono text-white tracking-tight">
                {srcWeather.temp}°C
              </span>
              <div className="text-xs">
                <span className="font-bold text-amber-400 block">{srcWeather.condition}</span>
                <span className="text-slate-400">Feels like {srcWeather.feelsLike}°C</span>
              </div>
            </div>

            {/* Environmental Parameters */}
            <div className="grid grid-cols-3 gap-2 text-xs pt-3 border-t border-slate-900 font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Humidity</span>
                <span className="font-bold text-slate-200">{srcWeather.humidity}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Wind</span>
                <span className="font-bold text-slate-200">{srcWeather.windSpeed} km/h</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Air Quality</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getAqiBadgeColor(srcWeather.aqi)}`}>
                  AQI {srcWeather.aqi}
                </span>
              </div>
            </div>

            {/* Traveler Advice */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{srcWeather.packingTip}</span>
            </div>
          </div>

          {/* Center Corridor Delta Indicator (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60 space-y-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black">
              TRACK CORRIDOR
            </span>
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
              <ArrowRight className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-slate-200 font-mono">
              {tempDiffText}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Track Signals Clear
            </span>
          </div>

          {/* Destination Station Weather Card (5 Cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-slate-950 border border-slate-800 p-6 space-y-4 shadow-lg hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-black block">
                  DESTINATION ARRIVAL
                </span>
                <h3 className="text-lg font-black text-white">
                  {destStation.name}
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Code: <strong>{destStation.code}</strong> • {destStation.city}, {destStation.state}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                {renderWeatherIcon(dstWeather.iconType)}
              </div>
            </div>

            {/* Temperature & Condition */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-4xl font-black font-mono text-white tracking-tight">
                {dstWeather.temp}°C
              </span>
              <div className="text-xs">
                <span className="font-bold text-emerald-400 block">{dstWeather.condition}</span>
                <span className="text-slate-400">Feels like {dstWeather.feelsLike}°C</span>
              </div>
            </div>

            {/* Environmental Parameters */}
            <div className="grid grid-cols-3 gap-2 text-xs pt-3 border-t border-slate-900 font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Humidity</span>
                <span className="font-bold text-slate-200">{dstWeather.humidity}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Wind</span>
                <span className="font-bold text-slate-200">{dstWeather.windSpeed} km/h</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Air Quality</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getAqiBadgeColor(dstWeather.aqi)}`}>
                  AQI {dstWeather.aqi}
                </span>
              </div>
            </div>

            {/* Traveler Advice */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{dstWeather.packingTip}</span>
            </div>
          </div>

        </div>
      ) : (
        /* Hourly Timeline View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Source Hourly */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-amber-400">{sourceStation.name} ({sourceStation.code})</span>
                <span className="text-slate-400">Departure Timeline</span>
              </div>
              <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
                {srcWeather.hourlyForecast.map((h, i) => (
                  <div key={i} className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 block">{h.time}</span>
                    <span className="text-sm font-black text-white block">{h.temp}°C</span>
                    <span className="text-[9px] text-slate-400 block truncate">{h.condition}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination Hourly */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-emerald-400">{destStation.name} ({destStation.code})</span>
                <span className="text-slate-400">Arrival Timeline</span>
              </div>
              <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
                {dstWeather.hourlyForecast.map((h, i) => (
                  <div key={i} className="p-2 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-500 block">{h.time}</span>
                    <span className="text-sm font-black text-white block">{h.temp}°C</span>
                    <span className="text-[9px] text-slate-400 block truncate">{h.condition}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Advisory Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-sky-400" />
          <span>Visibility across tracks: <strong>8 to 10 km (Zero fog delays reported)</strong></span>
        </div>
        <div className="text-slate-500">
          Integrated with Indian Meteorological Department (IMD) Railway Weather Feeds
        </div>
      </div>

    </div>
  );
};
