import { Ninja } from "@/types/index";

export function calculateDamage(attacker: Ninja, defender: Ninja): number {
  // Simple damage formula for starter mock purposes
  const damage = Math.max(1, attacker.baseStats.attack - defender.baseStats.defense);
  return damage;
}
