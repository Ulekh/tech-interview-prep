import React, { MouseEvent } from 'react';

type TabItem = {
  value: string;
  label: string;
  panel: string;
};

type Props = {
  defaultValue?: string;
  items: TabItem[];
};

export default function Tabs(props: Props) {
  const [activeTab, setActiveTab] = React.useState(props.defaultValue ?? props.items[0].value);
  console.log(activeTab);
  return (
    <div>
      <div role="tablist">
        {props.items.map((item) => {
          return (
            <button
              id={`tab-${item.value}`}
              role="tab"
              onClick={() => setActiveTab(item.value)}
              className={item.value === activeTab ? 'active' : ''}
              key={item.value}
              aria-selected={item.value === activeTab}
              aria-controls={`panel-${item.value}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
        {props.items.find((item) => item.value === activeTab)?.panel}
      </div>
    </div>
  );
}
