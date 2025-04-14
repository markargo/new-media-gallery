import React from 'react';

class CommonUI {

  private static instance: CommonUI;

  private constructor() {
    // Private constructor to prevent direct instantiation
    if (CommonUI.instance) {
      throw new Error("Error: Instantiation failed: Use CommonUI.getInstance() instead of new.");
    }
    CommonUI.instance = this;
    return this;
  }

  // Method to get the singleton instance
  public static getInstance(): CommonUI {
    if (!CommonUI.instance) {
      CommonUI.instance = new CommonUI();
    }
    return CommonUI.instance;
  }

  public renderTextTitle = (text: string) => {
    return (
      <div className='text-header'>
        { text }
      </div>
    );
  }
  
  public renderTextBlock = (text: string) => {
    return (
      <div className='text-block'>
        { text }
      </div>
    );
  }
  
}

const UI = CommonUI.getInstance();
export default UI;
