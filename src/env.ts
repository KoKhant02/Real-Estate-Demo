// ============================================
// ESTATE CONFIGURATION
// ============================================
// ✨ THIS IS THE ONLY FILE YOU NEED TO EDIT! ✨
//
// STEP 1: Paste your SVG code in DEFAULT_WARD_SVG below
// STEP 2: Add estate configurations in ESTATES array
// STEP 3: Match shapeId to data-id attributes in your SVG
//
// That's it! No manual coordinate conversion needed!
// ============================================

export interface Estate {
  shapeId: string;        // Must match the shape ID from SVG
  lotNumber: number;      // Display number
  status: 'available' | 'purchased' | 'reserved';
  price: number;          // Price in your currency
  area: number;           // Area in square meters
  streetFacing?: string;  // Optional street name
}

// -----------------
// ESTATE DEFINITIONS
// -----------------
// Map SVG shapes to estate data
// The 'shapeId' must match the ID of shapes in your SVG
// or use auto-generated IDs like 'rect-0', 'polygon-1', etc.

export const ESTATES: Estate[] = [
  { shapeId: 'estate-01', lotNumber: 1, status: 'available', price: 50000, area: 800, streetFacing: 'Main Street' },
  { shapeId: 'estate-02', lotNumber: 2, status: 'available', price: 55000, area: 800, streetFacing: 'Main Street' },
  { shapeId: 'estate-03', lotNumber: 3, status: 'available', price: 60000, area: 800, streetFacing: 'Main Street' },
  { shapeId: 'estate-04', lotNumber: 4, status: 'available', price: 65000, area: 800, streetFacing: 'Main Street' },
  { shapeId: 'estate-05', lotNumber: 5, status: 'available', price: 50000, area: 800, streetFacing: 'Main Street' },
  { shapeId: 'estate-06', lotNumber: 6, status: 'available', price: 50000, area: 800, streetFacing: 'Oak Avenue' },
  { shapeId: 'estate-07', lotNumber: 7, status: 'available', price: 50000, area: 800, streetFacing: 'Oak Avenue' },
  { shapeId: 'estate-08', lotNumber: 8, status: 'available', price: 50000, area: 800, streetFacing: 'Oak Avenue' },
  { shapeId: 'estate-09', lotNumber: 9, status: 'available', price: 50000, area: 800, streetFacing: 'Oak Avenue' },
  { shapeId: 'estate-10', lotNumber: 10, status: 'available', price: 55000, area: 850, streetFacing: 'Oak Avenue' },
  { shapeId: 'estate-11', lotNumber: 11, status: 'available', price: 55000, area: 850, streetFacing: 'Oak Avenue' },
  { shapeId: 'estate-12', lotNumber: 12, status: 'available', price: 55000, area: 850, streetFacing: 'Oak Avenue' },
  { shapeId: 'estate-13', lotNumber: 13, status: 'available', price: 55000, area: 850, streetFacing: 'Oak Avenue' },
  { shapeId: 'estate-14', lotNumber: 14, status: 'available', price: 60000, area: 900, streetFacing: 'Park Street' },
  { shapeId: 'estate-15', lotNumber: 15, status: 'available', price: 60000, area: 900, streetFacing: 'Park Street' },
  { shapeId: 'estate-16', lotNumber: 16, status: 'available', price: 60000, area: 900, streetFacing: 'Park Street' },
  { shapeId: 'estate-17', lotNumber: 17, status: 'available', price: 60000, area: 900, streetFacing: 'Park Street' },
  { shapeId: 'estate-18', lotNumber: 18, status: 'available', price: 65000, area: 950, streetFacing: 'Park Street' },
  { shapeId: 'estate-19', lotNumber: 19, status: 'available', price: 60000, area: 900, streetFacing: 'Park Street' },
  { shapeId: 'estate-20', lotNumber: 20, status: 'available', price: 60000, area: 900, streetFacing: 'Park Street' },
  { shapeId: 'estate-21', lotNumber: 21, status: 'available', price: 60000, area: 900, streetFacing: 'Park Street' },
  { shapeId: 'estate-22', lotNumber: 22, status: 'available', price: 65000, area: 950, streetFacing: 'Park Street' },
  { shapeId: 'estate-23', lotNumber: 23, status: 'available', price: 65000, area: 950, streetFacing: 'Park Street' },
  { shapeId: 'estate-24', lotNumber: 24, status: 'available', price: 70000, area: 1000, streetFacing: 'River Road' },
  { shapeId: 'estate-25', lotNumber: 25, status: 'available', price: 70000, area: 1000, streetFacing: 'River Road' },
  { shapeId: 'estate-26', lotNumber: 26, status: 'available', price: 70000, area: 1000, streetFacing: 'River Road' },
  { shapeId: 'estate-27', lotNumber: 27, status: 'available', price: 75000, area: 1050, streetFacing: 'River Road' },
  { shapeId: 'estate-28', lotNumber: 28, status: 'available', price: 70000, area: 1000, streetFacing: 'River Road' },
  { shapeId: 'estate-29', lotNumber: 29, status: 'available', price: 75000, area: 1050, streetFacing: 'River Road' },
  { shapeId: 'estate-30', lotNumber: 30, status: 'available', price: 70000, area: 1000, streetFacing: 'River Road' },
  { shapeId: 'estate-31', lotNumber: 31, status: 'available', price: 70000, area: 1000, streetFacing: 'River Road' },
  { shapeId: 'estate-32', lotNumber: 32, status: 'available', price: 75000, area: 1050, streetFacing: 'River Road' },
  { shapeId: 'estate-33', lotNumber: 33, status: 'available', price: 75000, area: 1050, streetFacing: 'River Road' },
  { shapeId: 'estate-34', lotNumber: 34, status: 'available', price: 65000, area: 950, streetFacing: 'Central Ave' },
  { shapeId: 'estate-35', lotNumber: 35, status: 'available', price: 60000, area: 900, streetFacing: 'Central Ave' },
  { shapeId: 'estate-36', lotNumber: 36, status: 'available', price: 65000, area: 950, streetFacing: 'Central Ave' },
  { shapeId: 'estate-37', lotNumber: 37, status: 'available', price: 65000, area: 950, streetFacing: 'Central Ave' },
  { shapeId: 'estate-38', lotNumber: 38, status: 'available', price: 60000, area: 900, streetFacing: 'Central Ave' },
  { shapeId: 'estate-39', lotNumber: 39, status: 'available', price: 60000, area: 900, streetFacing: 'Central Ave' },
  { shapeId: 'estate-40', lotNumber: 40, status: 'available', price: 65000, area: 950, streetFacing: 'Central Ave' },
  { shapeId: 'estate-41', lotNumber: 41, status: 'available', price: 65000, area: 950, streetFacing: 'Central Ave' },
  { shapeId: 'estate-42', lotNumber: 42, status: 'available', price: 70000, area: 1000, streetFacing: 'Lake View' },
  { shapeId: 'estate-43', lotNumber: 43, status: 'available', price: 70000, area: 1000, streetFacing: 'Lake View' },
  { shapeId: 'estate-44', lotNumber: 44, status: 'available', price: 70000, area: 1000, streetFacing: 'Lake View' },
  { shapeId: 'estate-45', lotNumber: 45, status: 'available', price: 70000, area: 1000, streetFacing: 'Lake View' },
  { shapeId: 'estate-46', lotNumber: 46, status: 'available', price: 75000, area: 1050, streetFacing: 'Lake View' },
  { shapeId: 'estate-47', lotNumber: 47, status: 'available', price: 75000, area: 1050, streetFacing: 'Lake View' },
  { shapeId: 'estate-48', lotNumber: 48, status: 'available', price: 70000, area: 1000, streetFacing: 'Sunset Blvd' },
  { shapeId: 'estate-49', lotNumber: 49, status: 'available', price: 75000, area: 1050, streetFacing: 'Sunset Blvd' },
  { shapeId: 'estate-50', lotNumber: 50, status: 'available', price: 75000, area: 1050, streetFacing: 'Sunset Blvd' },
  { shapeId: 'estate-51', lotNumber: 51, status: 'available', price: 80000, area: 1100, streetFacing: 'Sunset Blvd' }
];

// -----------------
// MAP SETTINGS
// -----------------
export const SHOW_COORDINATE_GRID = true;
export const ENABLE_ZOOM = true;
export const ENABLE_PAN = true;

// -----------------
// PROJECT INFO
// -----------------
export const PROJECT_NAME = "Real Estate Development";
export const PROJECT_LOCATION = "Yangon, Myanmar";

// -----------------
// DEFAULT SVG (Optional)
// -----------------
// You can set a default SVG here, or leave empty to use the importer
export const DEFAULT_WARD_SVG = `<svg width="1323" height="915" viewBox="0 0 1323 915" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="1323" height="915" fill="white"/>
<path data-id="ward-boundary" d="M892 552L1135 274L953 116C903.973 116 833.711 115.843 753 115.429M892 552L812 769M892 552L757.5 472.5L750.5 469.298M452 796.138C583.589 836.702 766.5 894 766.5 894L812 769M452 796.138C385.38 775.601 331.915 759.353 322 757C316.5 755.695 215 772 215 772C215 772 201.791 693 196.5 663.5C194.443 652.029 192.398 565.492 190.666 464M452 796.138L502 667.5M502 667.5L812 769M502 667.5L366.5 620.5H194.153M502 667.5C502 667.5 529.803 598.979 538 561C546.197 523.021 544 466.734 544 466.734M190.666 464C187.946 304.474 186 108 186 108C242.387 109.514 306.263 110.759 373 111.778M190.666 464L373 466.734M1024 396.5L908.5 297.5L190.666 289.5M373 111.778V466.734M373 111.778C428.9 112.632 486.806 113.326 544 113.888M373 466.734H544M544 113.888V466.734M544 113.888C616.679 114.6 688.206 115.097 753 115.429M544 466.734L750.5 469.298M753 115.429L750.5 469.298" stroke="black" stroke-width="19"/>
<g clip-path="url(#clip0_12_183)">
<path data-id="estate-01" d="M791.363 305.511H760L760.506 381.681H804.009L791.363 305.511Z" stroke="black"/>
<path data-id="estate-02" d="M859.652 305.511H791.363L804.009 381.681H840.936L859.652 305.511Z" stroke="black"/>
<path data-id="estate-03" d="M904.292 305L859.652 305.511L840.936 381.681L872.298 403.151L933 329.408L904.292 305Z" stroke="black"/>
<path data-id="estate-04" d="M819.184 381.681H760.506V439.447C762.246 458.555 768.545 467.062 786.81 479.321L819.184 381.681Z" stroke="black"/>
<path data-id="estate-05" d="M840.936 381.681H819.184L786.81 479.321L799.962 487.5L872.298 403.151L840.936 381.681Z" stroke="black"/>
<path data-id="estate-06" d="M744 305.066H696.547L696.547 380.467H742.946L744 305.066Z" stroke="black"/>
<path data-id="estate-07" d="M696.503 305.066L647.995 304.033V379.434L696.503 380.467V305.066Z" stroke="black"/>
<path data-id="estate-08" d="M647.995 304.033L600.497 303V379.434H647.995V304.033Z" stroke="black"/>
<path data-id="estate-09" d="M600.497 303H554.033L553 378.401L600.497 379.434V303Z" stroke="black"/>
<path data-id="estate-10" d="M600.497 379.434L553 378.401L553.505 458.967H598.476L600.497 379.434Z" stroke="black"/>
<path data-id="estate-11" d="M647.995 379.434H600.497L598.476 458.967L647.489 460L647.995 379.434Z" stroke="black"/>
<path data-id="estate-12" d="M696.503 380.467L647.995 379.434L647.489 460H696.503V380.467Z" stroke="black"/>
<path data-id="estate-13" d="M742.989 380.467H696.503V460H742.484L742.989 380.467Z" stroke="black"/>
<path data-id="estate-14" d="M201.036 541.441H261.757L258.215 472H198L201.036 541.441Z" stroke="black"/>
<path data-id="estate-15" d="M321.465 473.014L258.215 472L261.757 541.441L323.489 542.455L321.465 473.014Z" stroke="black"/>
<path data-id="estate-16" d="M384.21 473.014H321.465L323.489 542.455L384.21 542.962V473.014Z" stroke="black"/>
<path data-id="estate-17" d="M459.099 473.014H384.21V542.962L427.22 543.468L460.617 552.085L459.099 473.014Z" stroke="black"/>
<path data-id="estate-18" d="M535.499 473.007V473.008V473.014C535.499 473.018 535.5 473.025 535.5 473.034C535.5 473.052 535.501 473.079 535.501 473.114C535.502 473.185 535.503 473.289 535.504 473.426C535.507 473.7 535.511 474.104 535.516 474.624C535.525 475.664 535.536 477.167 535.542 479.023C535.555 482.733 535.551 487.851 535.486 493.482C535.354 504.736 534.975 518.067 533.978 526.295C532.983 534.506 531.336 544.527 529.94 552.49C529.241 556.473 528.605 559.944 528.144 562.418C527.913 563.655 527.725 564.644 527.596 565.323C527.531 565.663 527.481 565.925 527.446 566.103C527.429 566.191 527.416 566.258 527.407 566.304C527.403 566.326 527.4 566.344 527.398 566.356C527.397 566.361 527.395 566.365 527.395 566.368V566.372L526.904 566.277L527.394 566.373L527.296 566.878L526.794 566.766L461.014 552.066L460.63 551.981L460.623 551.588L459.105 473.53L459.095 473.024L459.602 473.021L534.996 472.514L535.493 472.511L535.499 473.007Z" stroke="black"/>
<path data-id="estate-19" d="M261.757 541.441H201.036L203.566 614.43H263.275L261.757 541.441Z" stroke="black"/>
<path data-id="estate-20" d="M323.489 542.455L261.757 541.441L263.275 614.43H325.007L323.489 542.455Z" stroke="black"/>
<path data-id="estate-21" d="M384.21 542.962L323.489 542.455L325.007 614.43L370.042 615.444L383.198 617.471L384.21 542.962Z" stroke="black"/>
<path data-id="estate-22" d="M427.22 543.468L384.21 542.962L383.198 617.471L442.906 637.239L460.617 552.085L427.22 543.468Z" stroke="black"/>
<path data-id="estate-23" d="M527.409 566.784L460.617 552.085L442.906 637.239L496.037 656.5L513.747 614.937L527.409 566.784Z" stroke="black"/>
<path data-id="estate-24" d="M611.21 477H553.357C553.357 477 554.795 533.878 549.224 552C543.654 570.122 542.509 572.5 542.509 572.5L617.925 582L611.21 477Z" stroke="black"/>
<path data-id="estate-25" d="M656.665 477H611.21L617.925 582L662.347 588.5L656.665 477Z" stroke="black"/>
<path data-id="estate-26" d="M700.055 478L656.665 477L662.347 588.5L699.022 594L705.737 596L700.055 478Z" stroke="black"/>
<path data-id="estate-27" d="M774.954 552L792 503.5C792 503.5 771.714 488.545 754.809 483C734.748 476.42 700.055 478 700.055 478L702.638 531.5L774.954 552Z" stroke="black"/>
<path data-id="estate-28" d="M594.164 579L542.509 572.5L511 661.5L560.588 676.5L594.164 579Z" stroke="black"/>
<path data-id="estate-29" d="M774.954 552L702.638 531.5L705.737 596L751.71 610.5L774.954 552Z" stroke="black"/>
<path data-id="estate-30" d="M627.222 583.5L594.164 579L560.588 676.5L593.131 687L627.222 583.5Z" stroke="black"/>
<path data-id="estate-31" d="M665.447 589L627.222 583.5L593.131 687L628.256 699L665.447 589Z" stroke="black"/>
<path data-id="estate-32" d="M699.022 594L665.447 589L648.401 640L729.498 668.5L751.71 610.5L699.022 594Z" stroke="black"/>
<path data-id="estate-33" d="M729.498 668.5L648.401 640L628.256 699L706.77 726L729.498 668.5Z" stroke="black"/>
<path data-id="estate-34" d="M433.902 653.871L365.08 630.036L342.139 687.033L409.942 710.868L433.902 653.871Z" stroke="black"/>
<path data-id="estate-35" d="M291.159 629H204.493C204.493 629 203.384 650.183 204.493 663.198C205.601 676.213 209.591 695.842 209.591 695.842L283.002 688.069L291.159 629Z" stroke="black"/>
<path data-id="estate-36" d="M365.08 630.036L291.159 629L283.002 688.069L330.923 683.406L342.139 687.033L365.08 630.036Z" stroke="black"/>
<path data-id="estate-37" d="M491 674.079L433.902 653.871L409.942 710.868L469.588 731.594L491 674.079Z" stroke="black"/>
<path data-id="estate-38" d="M266.688 689.624L209.591 695.842L220.296 762.683L272.296 754.393L266.688 689.624Z" stroke="black"/>
<path data-id="estate-39" d="M331.433 683.406L266.688 689.624L272.296 754.393C272.296 754.393 303.836 747.3 319.198 748.175C325.636 748.542 328.374 749.211 328.374 749.211L342.139 687.033L331.433 683.406Z" stroke="black"/>
<path data-id="estate-40" d="M409.942 710.868L342.139 687.033L328.374 749.211L388.021 767.347L409.942 710.868Z" stroke="black"/>
<path data-id="estate-41" d="M469.588 731.594L409.942 710.868L388.02 767.347L448.687 786L469.588 731.594Z" stroke="black"/>
<path data-id="estate-42" d="M555.408 693.681L507.193 679L486.099 733.167L532.807 750.379L555.408 693.681Z" stroke="black"/>
<path data-id="estate-43" d="M605.632 710.387L555.408 693.681L532.807 750.379L581.525 766.579L605.632 710.387Z" stroke="black"/>
<path data-id="estate-44" d="M657.865 727.599L605.632 710.387L581.525 766.579L636.771 784.297L657.865 727.599Z" stroke="black"/>
<path data-id="estate-45" d="M706.583 744.304L657.865 727.599L636.771 784.297L685.489 799.99L706.583 744.304Z" stroke="black"/>
<path data-id="estate-46" d="M752.789 759.997L706.583 744.304L685.489 799.99L731.695 814.165L752.789 759.997Z" stroke="black"/>
<path data-id="estate-47" d="M800 775.691L752.789 759.997L731.695 814.165L780.413 829.352L800 775.691Z" stroke="black"/>
<path data-id="estate-48" d="M558.924 759.491L486.099 733.167L464.5 790L536.5 812L558.924 759.491Z" stroke="black"/>
<path data-id="estate-49" d="M633.758 783.284L558.924 759.491L536.5 812L614.5 836.5L633.758 783.284Z" stroke="black"/>
<path data-id="estate-50" d="M709.596 807.584L633.758 783.284L614.5 836.5L689 860L709.596 807.584Z" stroke="black"/>
<path data-id="estate-51" d="M780.413 829.352L709.596 807.584L689 860.5L761.327 882L780.413 829.352Z" stroke="black"/>
</g>
<defs>
<clipPath id="clip0_12_183">
<rect width="1019" height="770" fill="white" transform="translate(200 128)"/>
</clipPath>
</defs>
</svg>`;