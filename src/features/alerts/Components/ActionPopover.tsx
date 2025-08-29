import React, { useState } from "react";
import { ArrowDown } from "lucide-react";

// ActionPopover component
export function AutomatedActionPopover({ onClose }) {
  return (
    <>
      {/* Dimmed background when popover is open */}
      <div className="fixed inset-0 bg-black/10 z-40" onClick={onClose} />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="bg-card p-3 rounded-lg">
          <div>Automated Action</div>
        </div>
      </div>
    </>
  );
}

export function CustomActionPopover({ onCloseA }) {
  return (
    <>
      {/* Dimmed background when popover is open */}
      <div className="fixed inset-0 bg-black/10 z-40" onClick={onCloseA} />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
        <div className="bg-card p-3 rounded-lg">
          <div>Custom Action</div>
        </div>
      </div>
    </>
  );
}
