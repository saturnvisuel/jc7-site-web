export function calculateCategory(birthDate: string): string {
  if (!birthDate) return "";
  
  const birthYear = new Date(birthDate).getFullYear();
  
  if (birthYear >= 2020) return "baby";
  if (birthYear >= 2018) return "mini-poussin";
  if (birthYear >= 2016) return "poussin";
  if (birthYear >= 2014) return "benjamin";
  if (birthYear >= 2012) return "minime";
  if (birthYear >= 2009) return "cadet";
  if (birthYear >= 2006) return "junior";
  return "senior";
}

export const CATEGORIES = [
  { value: "baby", label: "Éveil Judo / Baby Judo", age: "4-5 ans", years: "2020-2021" },
  { value: "mini-poussin", label: "Mini-Poussins / Poussinets", age: "6-7 ans", years: "2018-2019" },
  { value: "poussin", label: "Poussins", age: "8-9 ans", years: "2016-2017" },
  { value: "benjamin", label: "Benjamins", age: "10-11 ans", years: "2014-2015" },
  { value: "minime", label: "Minimes", age: "12-13 ans", years: "2012-2013" },
  { value: "cadet", label: "Cadets", age: "14-16 ans", years: "2009-2011" },
  { value: "junior", label: "Juniors", age: "17-19 ans", years: "2006-2008" },
  { value: "senior", label: "Seniors", age: "20 ans et +", years: "2005 et avant" },
] as const;

export const TARIFS: Record<string, number> = {
  baby: 150,
  "mini-poussin": 200,
  poussin: 200,
  benjamin: 200,
  minime: 200,
  cadet: 200,
  junior: 200,
  senior: 200,
};

export function getCategoryLabel(value: string): string {
  const category = CATEGORIES.find(c => c.value === value);
  return category ? `${category.label} (${category.age})` : value;
}

export function getTarif(category: string, childNumber: number = 1): number {
  const baseTarif = TARIFS[category] || 200;
  
  // Pas de réduction pour les seniors et les baby
  if (category === "senior" || category === "baby") {
    return baseTarif;
  }
  
  // Réductions pour plusieurs enfants
  if (childNumber === 1) {
    return baseTarif; // 200€
  }
  
  if (childNumber === 2) {
    return 185; // 2ème enfant : 185€
  }
  
  if (childNumber >= 3) {
    return 170; // 3ème enfant et + : 170€
  }
  
  return baseTarif;
}

export function calculateFamilyDiscount(registrations: Array<{ category: string }>): Array<{ category: string; tarif: number; childNumber: number }> {
  // Trier pour mettre les seniors et baby à la fin
  const sorted = [...registrations].sort((a, b) => {
    if ((a.category === "senior" || a.category === "baby") && b.category !== "senior" && b.category !== "baby") return 1;
    if ((b.category === "senior" || b.category === "baby") && a.category !== "senior" && a.category !== "baby") return -1;
    return 0;
  });
  
  let childCount = 0;
  
  return sorted.map((reg) => {
    // Les baby et seniors ne comptent pas dans les réductions
    if (reg.category === "senior" || reg.category === "baby") {
      return {
        category: reg.category,
        tarif: getTarif(reg.category, 1),
        childNumber: 0,
      };
    }
    
    // Les autres catégories bénéficient des réductions
    childCount++;
    return {
      category: reg.category,
      tarif: getTarif(reg.category, childCount),
      childNumber: childCount,
    };
  });
}
