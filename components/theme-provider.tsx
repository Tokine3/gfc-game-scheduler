'use client';

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute: string;
  defaultTheme: string;
  enableSystem: boolean;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  ...props
}) => {
  // Implement the theme provider logic here
  return <div {...props}>{children}</div>;
};

export default ThemeProvider;
