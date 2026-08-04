import React from "react";
import { Ninja } from "@/types/index";

interface Props {
  ninja: Ninja;
  isOpponent?: boolean;
}

export function BattleParticipantCard({ ninja, isOpponent = false }: Props) {
  return (
    <div className={`p-4 rounded-lg border ${isOpponent ? "border-red-500 bg-red-950/20" : "border-blue-500 bg-blue-950/20"}`}>
      <h4 className="font-bold text-lg">{ninja.name}</h4>
      <div className="mt-2 text-sm text-gray-400">
        <p>HP: {ninja.baseStats.hp}</p>
        <p>Chakra: {ninja.baseStats.chakra}</p>
      </div>
    </div>
  );
}
