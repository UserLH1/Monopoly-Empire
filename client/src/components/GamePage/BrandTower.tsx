import styles from "../../styles/GamePage/BrandTower.module.css";
import { Property } from "../../types/GameTypes";

interface BrandTowerProps {
  brands: Property[];
}

export default function BrandTower({ brands }: BrandTowerProps) {
  // Sort brands by some criteria if needed
  const sortedBrands = [...brands].sort();

  return (
    <div className={styles.tower}>
      <div className={styles.towerBase}></div>
      <div className={styles.brands}>
        {sortedBrands.map((brand, index) => (
          <div
            key={brand.id}
            className={styles.brand}
            style={{
              backgroundColor: brand.color,
              bottom: `${index * 25}px`,
            }}
          >
            <span>{brand.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
