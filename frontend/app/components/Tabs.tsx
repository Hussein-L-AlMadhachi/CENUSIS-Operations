import React from 'react';

interface TabItem {
    label: string;
    content: React.ReactNode;
}

interface TabsProps {
    tabs: TabItem[];
    group: string;
    defaultCheckedIndex?: number;
}

const Tabs: React.FC<TabsProps> = ({ tabs, group = "34", defaultCheckedIndex = 0 }) => {
    return (
        <div className="tabs tabs-border">
            {tabs.map((tab, index) => (
                <React.Fragment key={index}>
                    <input
                        type="radio"
                        name={group}
                        className="tab"
                        aria-label={tab.label}
                        readOnly
                    />
                    <div className="tab-content border-base-300 bg-base-100 p-10">
                        {tab.content}
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};

export default Tabs;