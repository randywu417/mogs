import { Box, BoxProps, Tab as MUITab, Tabs as MUITabs } from "@mui/material";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

export const CustomTabPanel: React.FC<TabPanelProps> = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            className="grow"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ height: "100%", py: 3, px: 2 }}>{children}</Box>
            )}
        </div>
    );
};

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

interface Props {
    box?: BoxProps;
    options: Array<{ label: string; panel: React.ReactNode }>;
    value: number;
    onChange: (newValue: number) => void;
}

export const Tabs: React.FC<Props> = ({ box, options, value, onChange }) => {
    return (
        <Box {...box}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <MUITabs
                    variant="fullWidth"
                    value={value}
                    onChange={(e, value) => onChange(value)}
                >
                    {options.map((option, index) => (
                        <MUITab
                            key={option.label}
                            label={option.label.toLocaleUpperCase()}
                            {...a11yProps(index)}
                        />
                    ))}
                </MUITabs>
            </Box>
            {options.map((option, index) => (
                <CustomTabPanel key={option.label} value={value} index={index}>
                    {option.panel}
                </CustomTabPanel>
            ))}
        </Box>
    );
};

export default Tabs;
