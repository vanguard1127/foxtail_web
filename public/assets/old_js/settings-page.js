// Settings: Age Range
var pmdSliderRangeTooltip = document.getElementById(
  "pmd-slider-range-tooltip-age"
);
noUiSlider.create(pmdSliderRangeTooltip, {
  start: [18, 34],
  connect: true,
  tooltips: [wNumb({ decimals: 0 }), wNumb({ decimals: 0 })],
  range: {
    min: 18,
    max: 80
  }
});

// Settings: Distance Range
var pmdSliderRangeTooltip = document.getElementById(
  "pmd-slider-range-tooltip-distance"
);
noUiSlider.create(pmdSliderRangeTooltip, {
  start: [1, 50],
  connect: true,
  tooltips: [wNumb({ decimals: 0 }), wNumb({ decimals: 0 })],
  range: {
    min: 1,
    max: 100
  }
});

// Filepond
FilePond.registerPlugin(FilePondPluginImagePreview);

FilePond.create(document.querySelector(".public"));
FilePond.create(document.querySelector(".private"));

FilePond.create(document.querySelector(".upload-verify .verify"));

FilePond.create(document.querySelector(".upload-avatar"), {
  labelIdle: `Upload Profile Picture`,
  imagePreviewHeight: 98,
  imageCropAspectRatio: "1:1",
  imageResizeTargetWidth: 98,
  imageResizeTargetHeight: 98,
  stylePanelLayout: "compact circle",
  styleLoadIndicatorPosition: "center bottom",
  styleProgressIndicatorPosition: "right bottom",
  styleButtonRemoveItemPosition: "left bottom",
  styleButtonProcessItemPosition: "right bottom"
});
