import React, { useId } from 'react';

interface BaubleToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
  disabled?: boolean;
}

// Bauble on/off toggle switch (Uiverse.io by Pradeepsaranbishnoi).
// Navigation: green = ON / activated, red = OFF / stopped.
export const BaubleToggle: React.FC<BaubleToggleProps> = ({
  checked,
  onChange,
  ariaLabel,
  disabled = false,
}) => {
  const id = useId();

  return (
    <span className="bauble_box">
      <style>{`
        .bauble_box .bauble_label {
          background: #2c2;
          background-position: 62px 5px;
          background-repeat: no-repeat;
          background-size: auto 5px;
          border: 0;
          border-radius: 50px;
          box-shadow: inset 0 10px 20px rgba(0,0,0,.4), 0 -1px 0px rgba(0,0,0,.2), inset 0 -1px 0px #fff;
          cursor: pointer;
          display: inline-block;
          font-size: 0;
          height: 40px;
          position: relative;
          -webkit-transition: all 500ms ease;
          transition: all 500ms ease;
          width: 90px;
        }

        .bauble_box .bauble_label:before {
          background-color: rgba(255,255,255,.2);
          background-position: 0 0;
          background-repeat: repeat;
          background-size: 30% auto;
          border-radius: 50%;
          box-shadow: inset 0 -5px 25px #050, 0 10px 20px rgba(0,0,0,.4);
          content: '';
          display: block;
          height: 30px;
          left: 5px;
          position: absolute;
          top: 6px;
          -webkit-transition: all 500ms ease;
          transition: all 500ms ease;
          width: 30px;
          z-index: 2;
        }

        .bauble_box input.bauble_input {
          opacity: 0;
          z-index: 0;
          width: 0;
          height: 0;
          margin: 0;
        }

        .bauble_box .bauble_label:active:before {
          width: 34px;
        }

        .bauble_box input.bauble_input:checked + .bauble_label {
          background-color: #c22;
        }

        .bauble_box input.bauble_input:checked + .bauble_label:before {
          background-position: 150% 0;
          box-shadow: inset 0 -5px 25px #500, 0 10px 20px rgba(0,0,0,.4);
          left: calc(100% - 35px);
        }

        .bauble_box input.bauble_input:disabled + .bauble_label {
          opacity: 0.45;
          cursor: not-allowed;
        }
      `}</style>

      <input
        className="bauble_input"
        id={id}
        type="checkbox"
        checked={!checked}
        onChange={(e) => onChange(!e.target.checked)}
        aria-label={ariaLabel}
        disabled={disabled}
      />
      <label className="bauble_label" htmlFor={id}>
        Toggle
      </label>
    </span>
  );
};