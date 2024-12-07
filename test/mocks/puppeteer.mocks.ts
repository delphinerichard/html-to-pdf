// Mock functions
export const mockSetContent = jest.fn();
export const mockPdf = jest.fn();
export const mockCloseBrowser = jest.fn();
export const mockClosePage = jest.fn();

// Mock page object
export const mockPage = {
  setContent: mockSetContent,
  pdf: mockPdf,
  close: mockClosePage,
};

// Mock browser object
export const mockNewPage = jest.fn();
export const mockBrowser = {
  newPage: mockNewPage,
  close: mockCloseBrowser,
};
export const mockLaunch = jest.fn();
