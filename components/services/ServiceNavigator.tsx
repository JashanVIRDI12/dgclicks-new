"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ServiceDefinition } from "./services-data";
import styles from "./ServicesUi.module.css";

type ServiceNavigatorProps = {
  activeIndex: number;
  onSelect: (index: number) => void;
  services: readonly ServiceDefinition[];
};

export default function ServiceNavigator({
  activeIndex,
  onSelect,
  services,
}: ServiceNavigatorProps) {
  const reducedMotion = useReducedMotion();

  return (
    <nav className={styles.navigator} aria-label="Services blueprint index">
      <p className={styles.navigatorLabel} aria-hidden="true">
        Drawing index
      </p>
      <ul className={styles.tabList}>
        {services.map((service, index) => {
          const selected = activeIndex === index;
          return (
            <li key={service.id}>
              <a
                href={`#service-panel-${service.id}`}
                className={styles.serviceTab}
                aria-current={selected ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  onSelect(index);
                }}
              >
                <span className={styles.tabNumber} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{service.name}</span>
                {selected ? (
                  <motion.span
                    layoutId="blueprint-active-service"
                    className={styles.activeTabLine}
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 360, damping: 34 }
                    }
                    aria-hidden="true"
                  />
                ) : null}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
