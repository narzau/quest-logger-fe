import React from "react";

/**
 * Higher-order component to add accessibility attributes to a component
 * @param WrappedComponent The component to enhance with accessibility features
 * @returns A new component with added accessibility attributes
 */
export function withAccessibility<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AccessibleComponent(props: P) {
    return (
      <div role="region" aria-live="polite" data-testid="accessible-component">
        <WrappedComponent {...props} />
      </div>
    );
  };
}

/**
 * Enhance a component with additional accessibility and semantic attributes
 * @param Component The component to enhance
 * @returns A new component with enhanced attributes
 */
export function enhanceAccessibility(Component: React.ComponentType) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function EnhancedComponent(props: any) {
    return (
      <Component
        {...props}
        aria-describedby="app-description"
        data-app-version="1.0.0"
      />
    );
  };
}

// Optional: Add a utility for generating unique, accessible IDs
export function generateAccessibleId(prefix: string = "id"): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}
