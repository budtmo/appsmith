import classNames from "classnames";
import { useDispatch } from "react-redux";
import React, { useMemo, useCallback } from "react";

import {
  getCurrentApplicationId,
  getCurrentApplicationLayout,
} from "selectors/editorSelectors";
import { useSelector } from "store";
import { Colors } from "constants/Colors";
import {
  AppLayoutConfig,
  SupportedLayouts,
} from "reducers/entityReducers/pageListReducer";
import TooltipComponent from "components/ads/Tooltip";
import Icon, { IconName, IconSize } from "components/ads/Icon";
import { updateApplicationLayout } from "actions/applicationActions";
import { ReflowBetaCard } from "./ReflowBetaCard";

interface AppsmithLayoutConfigOption {
  name: string;
  type: SupportedLayouts;
  icon?: IconName;
}

export const AppsmithDefaultLayout: AppLayoutConfig = {
  type: "FLUID",
};

const AppsmithLayouts: AppsmithLayoutConfigOption[] = [
  {
    name: "Fluid Width",
    type: "FLUID",
    icon: "fluid",
  },
  {
    name: "Desktop",
    type: "DESKTOP",
    icon: "desktop",
  },
  {
    name: "Tablet(Large)",
    type: "TABLET_LARGE",
    icon: "tablet",
  },
  {
    name: "Tablet",
    type: "TABLET",
    icon: "tablet",
  },
  {
    name: "Mobile Device",
    type: "MOBILE",
    icon: "mobile",
  },
];

export function MainContainerLayoutControl() {
  const dispatch = useDispatch();
  const appId = useSelector(getCurrentApplicationId);
  const appLayout = useSelector(getCurrentApplicationLayout);

  const buttonRefs: Array<HTMLButtonElement | null> = [];

  /**
   * return selected layout. if there is no app
   * layout, use the default one ( fluid )
   */
  const selectedLayout = useMemo(() => {
    return AppsmithLayouts.find(
      (each) => each.type === (appLayout?.type || AppsmithDefaultLayout.type),
    );
  }, [appLayout]);

  /**
   * updates the app layout
   *
   * @param layoutConfig
   */
  const updateAppLayout = useCallback(
    (layoutConfig: AppLayoutConfig) => {
      const { type } = layoutConfig;

      dispatch(
        updateApplicationLayout(appId || "", {
          appLayout: {
            type,
          },
        }),
      );
    },
    [dispatch, appLayout],
  );

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (!buttonRefs.length) return;
    switch (event.key) {
      case "Tab":
        event.preventDefault();
        break;
      case "ArrowRight":
      case "Right":
        const rightIndex = index === buttonRefs.length - 1 ? 0 : index + 1;
        buttonRefs[rightIndex]?.focus();
        break;
      case "ArrowLeft":
      case "Left":
        const leftIndex = index === 0 ? buttonRefs.length - 1 : index - 1;
        buttonRefs[leftIndex]?.focus();
        break;
    }
  };

  return (
    <div className="px-3 space-y-2 t--layout-control-wrapper">
      <p className="text-sm text-gray-700">Canvas Size</p>
      <div className="flex justify-around">
        {AppsmithLayouts.map((layoutOption: any, index: number) => {
          return (
            <TooltipComponent
              className="flex-grow"
              content={layoutOption.name}
              key={layoutOption.name}
              position={
                index === AppsmithLayouts.length - 1 ? "bottom-right" : "bottom"
              }
            >
              <button
                className={classNames({
                  "border-transparent border flex items-center justify-center p-2 flex-grow": true,
                  "bg-white border-gray-300":
                    selectedLayout?.name === layoutOption.name,
                  "bg-gray-100 hover:bg-gray-200 focus:bg-gray-200":
                    selectedLayout?.name !== layoutOption.name,
                })}
                onClick={() => updateAppLayout(layoutOption)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                ref={(input) => buttonRefs.push(input)}
              >
                <Icon
                  fillColor={Colors.BLACK}
                  name={layoutOption.icon}
                  size={layoutOption.iconSize || IconSize.MEDIUM}
                />
              </button>
            </TooltipComponent>
          );
        })}
      </div>
      <ReflowBetaCard />
    </div>
  );
}
