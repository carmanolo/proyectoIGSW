import "cally";

import React from "react";
import ReactDOM from "react-dom";
import ReactDOMServer from "react-dom/server";

export const createSwalField_OLD = (inputId, label, value) => {
    return `
        <div class="input m-1 form-group">
            <label for="swal2-input${Number(inputId)}" class="label">${label}</label>  
            <input id="swal2-input${Number(inputId)}" placeholder="${label}" value="${value}"></input>
        </div>        
    `
}

export const createSwalDateField_OLD = (inputId, label, value) => {
    return `
    <label class="input m-1">
        <span class="label">${label}</span>
        <input type="date" id="swal2-input${Number(inputId)}" value="${value || getToday()}" />
    </label>
    `
};

export const createSwalField = (inputId, label, value) => {
  return `
    <div class="input m-1 form-group">
      <label for="swal2-input${inputId}" class="label">${label}</label>  
      <input 
        id="swal2-input${inputId}" 
        placeholder="${label}" 
        value="${value ?? ""}">
    </div>
  `;
};

export const createSwalTextarea = (inputId, label, value) => {
  return `
    <legend for="swal2-input${inputId}" class="fieldset-legend center content-center">
      ${label}
    </legend>
    <div class="textarea-container m-1 form-group center content-center justify-center align-center center-items">
      <fieldset class="fieldset">
        <textarea 
          class="textarea h-24" 
          id="swal2-input${inputId}" 
          placeholder="${value ?? ""}">
        </textarea>
      </fieldset> 
    </div>
  `;
};

export const createSwalDateField = (inputId, label, value = "") => {
  return `
    <label class="input m-1">
      <span class="label">${label}</span>
      <input 
        type="date" 
        id="swal2-input${inputId}" 
        value="${value ?? ""}" />
    </label>
  `;
};

export const createSwalCallyField = (inputId, label, value = "") => {
  return ReactDOMServer.renderToStaticMarkup(
    /* <calendar-date className="cally bg-base-100 border border-base-300 shadow-lg rounded-box" id={`swal2-input${Number(inputId)}`}>
      <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
      <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
      <calendar-month></calendar-month>
    </calendar-date> */
    <div>
      <button popovertarget={`cally-popover${inputId}`} className="input input-border" id={`cally${inputId}`} style={{anchorName : ("--cally" + inputId)}}>
        {label}
      </button>
      <div popover="true" id={`cally-popover${inputId}`} className="dropdown bg-base-100 rounded-box shadow-lg" style={{positionAnchor : ("--cally" + inputId)}}>
        <calendar-date className="cally" value={`${value}`} onChange={() => {
            console.log(document);
            console.log(document.getElementById(`cally${inputId}`));
            console.log(document.getElementById(`cally${inputId}`).innerText);
            document.getElementById(`cally${inputId}`).innerText = this.value
        }}>
          <svg aria-label="Previous" className="fill-current size-4" slot="previous" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
          <svg aria-label="Next" className="fill-current size-4" slot="next" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
          <calendar-month></calendar-month>
        </calendar-date>
      </div>
    </div>
  )
}