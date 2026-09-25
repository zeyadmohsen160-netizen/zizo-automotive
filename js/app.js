/* =========================================================
   ZIZO AUTOMOTIVE
   MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   TRANSLATIONS
========================================================= */

const translations = {

    ar: {

        home: "الرئيسية",
        cars: "السيارات",
        sell: "اعرض عربيتك",
        contact: "تواصل معنا",

        browse: "تصفح السيارات",

        heroSmall: "زيزو أوتوموتيف",

        heroTitle1: "اختار العربية المناسبة.",
        heroTitle2: "إحنا نفحصها.",
        heroTitle3: "وإنت تقرر.",

        heroText:
            "زيزو أوتوموتيف يربط المشترين الجادين بأصحاب السيارات، مع فحص ومعاينة وتقييم العربية قبل إتمام الصفقة.",

        how: "إزاي بنشتغل",

        howTitle:
            "شراء العربية أصبح أسهل.",

        howText:
            "اختار العربية، اطلب المعاينة، وإحنا نتولى الخطوة التالية.",

        step1:
            "اختار العربية",

        step1Text:
            "تصفح السيارات المعروضة وشوف المواصفات والكيلومترات والسعر وبيانات الرخصة.",

        step2:
            "اطلب المعاينة",

        step2Text:
            "لو عجبتك عربية، ابعت بياناتك وإحنا نرتب لمعاينة العربية.",

        step3:
            "نفحص ونتفاوض",

        step3Text:
            "ننزل نفحص العربية ونساعد المشتري والبائع في إتمام الصفقة.",

        sellTitle:
            "عندك عربية للبيع؟",

        sellText:
            "خلي زيزو أوتوموتيف يساعدك توصل لمشتري جاد.",

        carInformation:
            "بيانات العربية",

        brand:
            "الماركة",

        model:
            "الموديل",

        year:
            "سنة الصنع",

        mileage:
            "الكيلومترات",

        price:
            "السعر المطلوب",

        transmission:
            "ناقل الحركة",

        condition:
            "حالة العربية",

        traffic:
            "المرور",

        license:
            "الرخصة فاضل فيها قد إيه؟",

        description:
            "وصف العربية",

        carImages:
            "صور العربية",

        imagesNote:
            "يمكنك رفع حتى 20 صورة، ويفضل صور واضحة للعربية.",

        uploadImages:
            "اختر الصور",

        privateInformation:
            "بيانات خاصة",

        privateText:
            "هذه البيانات لن تظهر في إعلان العربية.",

        sellerName:
            "اسم صاحب العربية",

        sellerPhone:
            "رقم صاحب العربية",

        carLocation:
            "مكان العربية",

        locationNote:
            "المكان سيظهر لك أنت فقط كوسيط ولن يظهر للمشتري.",

        submitCar:
            "إرسال بيانات العربية",

        requestInspection:
            "اطلب معاينة",

        contactText:
            "عجبتك عربية؟ تواصل معنا وإحنا نرتب المعاينة.",

        buyerName:
            "اسم المشتري",

        buyerPhone:
            "رقم المشتري",

        sendRequest:
            "إرسال طلب المعاينة",

        footerText:
            "وساطة سيارات وفحص ومعاينة وبيع السيارات."

    },


    en: {

        home: "Home",
        cars: "Cars",
        sell: "Sell Your Car",
        contact: "Contact",

        browse: "Browse Cars",

        heroSmall:
            "Zizo Automotive",

        heroTitle1:
            "Find the right car.",

        heroTitle2:
            "We inspect it.",

        heroTitle3:
            "You decide.",

        heroText:
            "Zizo Automotive connects serious buyers with car owners while helping with inspection, evaluation and the deal.",

        how:
            "How It Works",

        howTitle:
            "Buying a car is easier.",

        howText:
            "Choose a car, request an inspection and we handle the next step.",

        step1:
            "Choose a Car",

        step1Text:
            "Browse available cars and check specifications, mileage, price and license information.",

        step2:
            "Request Inspection",

        step2Text:
            "Interested in a car? Send us your details and we will arrange an inspection.",

        step3:
            "Inspect & Negotiate",

        step3Text:
            "We inspect the car and help the buyer and seller complete the deal.",

        sellTitle:
            "Have a car to sell?",

        sellText:
            "Let Zizo Automotive help you reach a serious buyer.",

        carInformation:
            "Car Information",

        brand:
            "Brand",

        model:
            "Model",

        year:
            "Year",

        mileage:
            "Mileage",

        price:
            "Asking Price",

        transmission:
            "Transmission",

        condition:
            "Condition",

        traffic:
            "Traffic Department",

        license:
            "License Remaining",

        description:
            "Description",

        carImages:
            "Car Images",

        imagesNote:
            "You can upload up to 20 images.",

        uploadImages:
            "Choose Images",

        privateInformation:
            "Private Information",

        privateText:
            "This information will NOT appear in the public car listing.",

        sellerName:
            "Seller Name",

        sellerPhone:
            "Seller Phone",

        carLocation:
            "Car Location",

        locationNote:
            "The location is visible only to you as the broker.",

        submitCar:
            "Submit Car",

        requestInspection:
            "Request Inspection",

        contactText:
            "Interested in this car? Contact us and we will arrange the inspection.",

        buyerName:
            "Buyer Name",

        buyerPhone:
            "Buyer Phone",

        sendRequest:
            "Send Inspection Request",

        footerText:
            "Car brokerage, inspection and vehicle sales."

    }

};


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let currentLanguage =
    localStorage.getItem("zizoLanguage") || "ar";

let currentCarImages = [];

let currentGalleryIndex = 0;


/* =========================================================
   LANGUAGE
========================================================= */

function applyLanguage() {

    const language =
        translations[currentLanguage];

    document.documentElement.lang =
        currentLanguage;

    document.documentElement.dir =
        currentLanguage === "ar"
            ? "rtl"
            : "ltr";

    if (document.body) {

        document.body.classList.toggle(
            "rtl",
            currentLanguage === "ar"
        );

        document.body.classList.toggle(
            "ltr",
            currentLanguage === "en"
        );

    }

    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {

            const key =
                element.dataset.i18n;

            if (
                language &&
                language[key]
            ) {

                element.textContent =
                    language[key];

            }

        });


    document
        .querySelectorAll("[data-placeholder]")
        .forEach(element => {

            const key =
                element.dataset.placeholder;

            if (
                language &&
                language[key]
            ) {

                element.placeholder =
                    language[key];

            }

        });


    const languageButton =
        document.getElementById(
            "languageBtn"
        );

    if (languageButton) {

        languageButton.textContent =
            currentLanguage === "ar"
                ? "EN"
                : "عربي";

    }


    localStorage.setItem(
        "zizoLanguage",
        currentLanguage
    );

}


function toggleLanguage() {

    currentLanguage =
        currentLanguage === "ar"
            ? "en"
            : "ar";

    applyLanguage();

}


/* =========================================================
   LOAD ALL CARS
========================================================= */

async function loadCars() {

    const container =
        document.getElementById(
            "carsContainer"
        );

    if (!container) {
        return;
    }

    try {

        const response =
            await fetch("/api/cars");

        const data =
            await response.json();

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Could not load cars."
            );

        }


        if (
            !Array.isArray(data.cars) ||
            data.cars.length === 0
        ) {

            container.innerHTML = `

                <div
                    style="
                        grid-column:1/-1;
                        text-align:center;
                        padding:70px 20px;
                    "
                >

                    <h3>
                        ${
                            currentLanguage === "ar"
                                ? "لا توجد سيارات متاحة حاليًا"
                                : "No cars available"
                        }
                    </h3>

                    <p>
                        ${
                            currentLanguage === "ar"
                                ? "سيتم إضافة السيارات قريبًا."
                                : "Cars will be added soon."
                        }
                    </p>

                </div>

            `;

            return;
        }


        container.innerHTML = "";


        data.cars.forEach(car => {

            const card =
                createCarCard(car);

            container.appendChild(card);

        });

    }

    catch (error) {

        console.error(
            "Load cars error:",
            error
        );


        container.innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    text-align:center;
                    padding:70px 20px;
                "
            >

                <h3>
                    ${
                        currentLanguage === "ar"
                            ? "حدث خطأ أثناء تحميل السيارات"
                            : "Could not load cars"
                    }
                </h3>

                <p>
                    ${
                        currentLanguage === "ar"
                            ? "تأكد أن السيرفر يعمل."
                            : "Make sure the server is running."
                    }
                </p>

            </div>

        `;

    }

}


/* =========================================================
   CREATE CAR CARD
========================================================= */

function createCarCard(car) {

    const article =
        document.createElement("article");

    article.className =
        "car-card";


    let image =
        car.main_image || null;


    if (
        !image &&
        Array.isArray(car.images) &&
        car.images.length > 0
    ) {

        image =
            car.images[0];

    }


    if (!image) {

        image =
            "images/car-placeholder.jpg";

    }


    const formattedPrice =
        car.price
            ? Number(car.price).toLocaleString("en-US") + " EGP"
            : (
                currentLanguage === "ar"
                    ? "السعر عند الطلب"
                    : "Price on request"
            );


    article.innerHTML = `

        <div class="car-card-image">

            <img
                src="${escapeHtml(image)}"
                alt="${escapeHtml(car.brand)} ${escapeHtml(car.model)}"
                loading="lazy"
                onerror="this.src='images/car-placeholder.jpg';"
            >

        </div>


        <div class="car-card-content">

            <div class="car-card-title">

                <h3>
                    ${escapeHtml(car.brand)}
                    ${escapeHtml(car.model)}
                </h3>

                <span>
                    ${escapeHtml(car.year || "-")}
                </span>

            </div>


            <div class="car-card-meta">

                <span>
                    ${
                        car.mileage
                            ? Number(car.mileage).toLocaleString("en-US") + " KM"
                            : "-"
                    }
                </span>


                <span>
                    ${escapeHtml(car.transmission || "-")}
                </span>

            </div>


            <div class="car-card-bottom">

                <strong>
                    ${formattedPrice}
                </strong>


                <a
                    href="car-details.html?id=${encodeURIComponent(car.id)}"
                    class="btn"
                >
                    ${
                        currentLanguage === "ar"
                            ? "التفاصيل"
                            : "Details"
                    }
                </a>

            </div>

        </div>

    `;


    return article;

}


/* =========================================================
   LOAD CAR DETAILS
========================================================= */

async function loadCarDetails() {

    const container =
        document.getElementById(
            "carDetails"
        );

    if (!container) {
        return;
    }


    const params =
        new URLSearchParams(
            window.location.search
        );


    const carId =
        params.get("id");


    if (!carId) {

        container.innerHTML = `

            <div
                style="
                    text-align:center;
                    padding:80px 20px;
                "
            >

                <h2>
                    ${
                        currentLanguage === "ar"
                            ? "لم يتم تحديد السيارة"
                            : "No car selected"
                    }
                </h2>

                <a
                    href="cars.html"
                    class="btn"
                >
                    ${
                        currentLanguage === "ar"
                            ? "العودة للسيارات"
                            : "Back to Cars"
                    }
                </a>

            </div>

        `;

        return;
    }


    try {

        const response =
            await fetch(
                `/api/cars/${encodeURIComponent(carId)}`
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Car not found."
            );

        }


        const car =
            data.car;


        document.title =
            `${car.brand} ${car.model} | Zizo Automotive`;


        /* =================================================
           IMAGES
        ================================================= */

        const images =
            Array.isArray(car.images)
                ? car.images.filter(
                    image =>
                        typeof image === "string" &&
                        image.trim() !== ""
                )
                : [];


        currentCarImages =
            images;


        currentGalleryIndex =
            0;


        const mainImage =
            images.length > 0
                ? images[0]
                : "images/car-placeholder.jpg";


        /* =================================================
           CAR DATA
        ================================================= */

        const price =
            car.price
                ? Number(car.price).toLocaleString("en-US") + " EGP"
                : (
                    currentLanguage === "ar"
                        ? "السعر عند الطلب"
                        : "Price on request"
                );


        const year =
            car.year || "-";


        const mileage =
            car.mileage
                ? Number(car.mileage).toLocaleString("en-US") + " KM"
                : "-";


        const transmission =
            car.transmission || "-";


        const condition =
            car.condition || "-";


        const traffic =
            car.traffic_department || "-";


        const license =
            car.license_remaining || "-";


        const description =
            car.description ||
            (
                currentLanguage === "ar"
                    ? "لا يوجد وصف إضافي."
                    : "No additional description."
            );


        /* =================================================
           HTML
        ================================================= */

        container.innerHTML = `

            <div class="car-details">


                <!-- GALLERY -->

                <div class="car-details-gallery">

                    <div
                        class="main-car-image-wrapper"
                        onclick="openCarGallery(0)"
                        style="
                            position:relative;
                            cursor:pointer;
                        "
                    >

                        <img
                            id="mainCarImage"
                            src="${escapeHtml(mainImage)}"
                            alt="${escapeHtml(car.brand)} ${escapeHtml(car.model)}"
                            onerror="this.src='images/car-placeholder.jpg';"
                        >


                        ${
                            images.length > 1
                                ? `
                                    <div
                                        style="
                                            position:absolute;
                                            bottom:15px;
                                            right:15px;
                                            background:rgba(0,0,0,.75);
                                            color:#fff;
                                            padding:8px 14px;
                                            border-radius:8px;
                                            font-size:14px;
                                            pointer-events:none;
                                        "
                                    >
                                        📷
                                        ${images.length}
                                        ${
                                            currentLanguage === "ar"
                                                ? "صور"
                                                : "Photos"
                                        }
                                    </div>
                                `
                                : ""
                        }

                    </div>


                    <!-- THUMBNAILS -->

                    <div class="car-thumbnails">

                        ${
                            images.length > 0
                                ? images.map(
                                    (image, index) => `
                                        <button
                                            type="button"
                                            onclick="changeMainImage(${index})"
                                            aria-label="Image ${index + 1}"
                                        >

                                            <img
                                                src="${escapeHtml(image)}"
                                                alt="Car image ${index + 1}"
                                                loading="lazy"
                                                onerror="this.style.display='none';"
                                            >

                                        </button>
                                    `
                                ).join("")
                                : ""
                        }

                    </div>

                </div>


                <!-- CAR INFORMATION -->

                <div class="car-details-info">

                    <div class="eyebrow">
                        ZIZO AUTOMOTIVE
                    </div>


                    <h1>
                        ${escapeHtml(car.brand)}
                        ${escapeHtml(car.model)}
                    </h1>


                    <div class="car-price">
                        ${price}
                    </div>


                    <div class="car-specs">

                        <div>
                            <span>
                                ${
                                    currentLanguage === "ar"
                                        ? "السنة"
                                        : "Year"
                                }
                            </span>

                            <strong>
                                ${escapeHtml(year)}
                            </strong>
                        </div>


                        <div>
                            <span>
                                ${
                                    currentLanguage === "ar"
                                        ? "الكيلومترات"
                                        : "Mileage"
                                }
                            </span>

                            <strong>
                                ${escapeHtml(mileage)}
                            </strong>
                        </div>


                        <div>
                            <span>
                                ${
                                    currentLanguage === "ar"
                                        ? "الفتيس"
                                        : "Transmission"
                                }
                            </span>

                            <strong>
                                ${escapeHtml(transmission)}
                            </strong>
                        </div>


                        <div>
                            <span>
                                ${
                                    currentLanguage === "ar"
                                        ? "الحالة"
                                        : "Condition"
                                }
                            </span>

                            <strong>
                                ${escapeHtml(condition)}
                            </strong>
                        </div>


                        <div>
                            <span>
                                ${
                                    currentLanguage === "ar"
                                        ? "المرور"
                                        : "Traffic"
                                }
                            </span>

                            <strong>
                                ${escapeHtml(traffic)}
                            </strong>
                        </div>


                        <div>
                            <span>
                                ${
                                    currentLanguage === "ar"
                                        ? "الرخصة"
                                        : "License"
                                }
                            </span>

                            <strong>
                                ${escapeHtml(license)}
                            </strong>
                        </div>

                    </div>


                    <!-- DESCRIPTION -->

                    <div class="car-description">

                        <h3>
                            ${
                                currentLanguage === "ar"
                                    ? "تفاصيل العربية"
                                    : "Car Description"
                            }
                        </h3>


                        <p>
                            ${escapeHtml(description)}
                        </p>

                    </div>


                    <!-- INSPECTION -->

                    <button
                        type="button"
                        class="btn"
                        onclick="openInspectionModal(${Number(car.id)})"
                    >
                        ${
                            currentLanguage === "ar"
                                ? "اطلب معاينة العربية"
                                : "Request Inspection"
                        }
                    </button>

                </div>

            </div>


            <!-- FULL SCREEN GALLERY -->

            <div
                id="carGalleryModal"
                class="car-gallery-modal"
                onclick="handleGalleryBackgroundClick(event)"
            >

                <button
                    type="button"
                    class="gallery-close"
                    onclick="closeCarGallery(event)"
                    aria-label="Close"
                >
                    ×
                </button>


                <button
                    type="button"
                    class="gallery-prev"
                    onclick="previousGalleryImage(event)"
                    aria-label="Previous"
                >
                    ❮
                </button>


                <div
                    class="gallery-content"
                    onclick="event.stopPropagation()"
                >

                    <img
                        id="galleryMainImage"
                        src="${escapeHtml(mainImage)}"
                        alt="Car"
                    >


                    <div
                        id="galleryCounter"
                        class="gallery-counter"
                    >
                        ${
                            images.length > 0
                                ? `1 / ${images.length}`
                                : ""
                        }
                    </div>

                </div>


                <button
                    type="button"
                    class="gallery-next"
                    onclick="nextGalleryImage(event)"
                    aria-label="Next"
                >
                    ❯
                </button>

            </div>

        `;


        addGalleryStyles();


        if (images.length > 0) {
            changeMainImage(0);
        }

    }

    catch (error) {

        console.error(
            "Car details error:",
            error
        );


        container.innerHTML = `

            <div
                style="
                    text-align:center;
                    padding:80px 20px;
                "
            >

                <h2>
                    ${
                        currentLanguage === "ar"
                            ? "لم نتمكن من تحميل بيانات العربية"
                            : "Could not load car details"
                    }
                </h2>


                <p
                    style="
                        color:#777;
                        margin:15px 0 25px;
                    "
                >
                    ${escapeHtml(error.message || "")}
                </p>


                <a
                    href="cars.html"
                    class="btn"
                >
                    ${
                        currentLanguage === "ar"
                            ? "العودة للسيارات"
                            : "Back to Cars"
                    }
                </a>

            </div>

        `;

    }

}


/* =========================================================
   CHANGE MAIN IMAGE
========================================================= */

function changeMainImage(index) {

    if (
        !Array.isArray(currentCarImages) ||
        currentCarImages.length === 0
    ) {
        return;
    }


    index =
        Number(index);


    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= currentCarImages.length
    ) {
        return;
    }


    currentGalleryIndex =
        index;


    const image =
        currentCarImages[index];


    const mainImage =
        document.getElementById(
            "mainCarImage"
        );


    if (mainImage) {

        mainImage.src =
            image;

    }


    const thumbnails =
        document.querySelectorAll(
            ".car-thumbnails button"
        );


    thumbnails.forEach(
        (button, buttonIndex) => {

            button.classList.toggle(
                "active",
                buttonIndex === index
            );

        }
    );

}


/* =========================================================
   OPEN GALLERY
========================================================= */

function openCarGallery(index = 0) {

    if (
        !Array.isArray(currentCarImages) ||
        currentCarImages.length === 0
    ) {
        return;
    }


    index =
        Number(index);


    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= currentCarImages.length
    ) {

        index = 0;

    }


    currentGalleryIndex =
        index;


    updateGalleryImage();


    const modal =
        document.getElementById(
            "carGalleryModal"
        );


    if (!modal) {
        return;
    }


    modal.classList.add("show");

    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE GALLERY
========================================================= */

function closeCarGallery(event) {

    if (event) {
        event.stopPropagation();
    }


    const modal =
        document.getElementById(
            "carGalleryModal"
        );


    if (modal) {

        modal.classList.remove("show");

    }


    document.body.style.overflow =
        "";

}


/* =========================================================
   UPDATE GALLERY
========================================================= */

function updateGalleryImage() {

    if (
        !Array.isArray(currentCarImages) ||
        currentCarImages.length === 0
    ) {
        return;
    }


    const image =
        currentCarImages[currentGalleryIndex];


    const galleryImage =
        document.getElementById(
            "galleryMainImage"
        );


    const counter =
        document.getElementById(
            "galleryCounter"
        );


    if (galleryImage) {

        galleryImage.src =
            image;

    }


    if (counter) {

        counter.textContent =
            `${currentGalleryIndex + 1} / ${currentCarImages.length}`;

    }


    const mainImage =
        document.getElementById(
            "mainCarImage"
        );


    if (mainImage) {

        mainImage.src =
            image;

    }


    const thumbnails =
        document.querySelectorAll(
            ".car-thumbnails button"
        );


    thumbnails.forEach(
        (button, index) => {

            button.classList.toggle(
                "active",
                index === currentGalleryIndex
            );

        }
    );

}


/* =========================================================
   NEXT IMAGE
========================================================= */

function nextGalleryImage(event) {

    if (event) {
        event.stopPropagation();
    }


    if (
        !Array.isArray(currentCarImages) ||
        currentCarImages.length === 0
    ) {
        return;
    }


    currentGalleryIndex++;


    if (
        currentGalleryIndex >=
        currentCarImages.length
    ) {

        currentGalleryIndex =
            0;

    }


    updateGalleryImage();

}


/* =========================================================
   PREVIOUS IMAGE
========================================================= */

function previousGalleryImage(event) {

    if (event) {
        event.stopPropagation();
    }


    if (
        !Array.isArray(currentCarImages) ||
        currentCarImages.length === 0
    ) {
        return;
    }


    currentGalleryIndex--;


    if (
        currentGalleryIndex < 0
    ) {

        currentGalleryIndex =
            currentCarImages.length - 1;

    }


    updateGalleryImage();

}


/* =========================================================
   GALLERY BACKGROUND
========================================================= */

function handleGalleryBackgroundClick(event) {

    if (
        event.target &&
        event.target.id ===
            "carGalleryModal"
    ) {

        closeCarGallery();

    }

}


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        const modal =
            document.getElementById(
                "carGalleryModal"
            );


        if (
            !modal ||
            !modal.classList.contains("show")
        ) {
            return;
        }


        if (event.key === "Escape") {

            closeCarGallery();

            return;

        }


        if (event.key === "ArrowRight") {

            nextGalleryImage();

        }


        if (event.key === "ArrowLeft") {

            previousGalleryImage();

        }

    }
);


/* =========================================================
   GALLERY CSS
========================================================= */

function addGalleryStyles() {

    if (
        document.getElementById(
            "zizoGalleryStyles"
        )
    ) {
        return;
    }


    const style =
        document.createElement("style");


    style.id =
        "zizoGalleryStyles";


    style.textContent = `

        .car-gallery-modal {

            position: fixed;

            inset: 0;

            width: 100%;

            height: 100%;

            background:
                rgba(0, 0, 0, 0.95);

            z-index: 99999;

            display: flex;

            align-items: center;

            justify-content: center;

            opacity: 0;

            visibility: hidden;

            pointer-events: none;

            transition:
                opacity .25s ease,
                visibility .25s ease;

        }


        .car-gallery-modal.show {

            opacity: 1;

            visibility: visible;

            pointer-events: auto;

        }


        .gallery-content {

            width: min(90vw, 1200px);

            height: min(82vh, 800px);

            display: flex;

            align-items: center;

            justify-content: center;

            position: relative;

        }


        .gallery-content img {

            max-width: 100%;

            max-height: 100%;

            width: auto;

            height: auto;

            object-fit: contain;

            border-radius: 10px;

            user-select: none;

        }


        .gallery-close {

            position: absolute;

            top: 20px;

            right: 25px;

            width: 48px;

            height: 48px;

            border: none;

            border-radius: 50%;

            background:
                rgba(255,255,255,.12);

            color: white;

            font-size: 36px;

            line-height: 40px;

            cursor: pointer;

            z-index: 100;

        }


        .gallery-close:hover {

            background:
                rgba(255,255,255,.25);

        }


        .gallery-prev,
        .gallery-next {

            position: absolute;

            top: 50%;

            transform:
                translateY(-50%);

            width: 52px;

            height: 70px;

            border: none;

            background:
                rgba(255,255,255,.12);

            color: white;

            font-size: 30px;

            cursor: pointer;

            z-index: 100;

            border-radius: 8px;

        }


        .gallery-prev {

            right: 25px;

        }


        .gallery-next {

            left: 25px;

        }


        .gallery-prev:hover,
        .gallery-next:hover {

            background:
                rgba(255,255,255,.25);

        }


        .gallery-counter {

            position: absolute;

            bottom: -45px;

            left: 50%;

            transform:
                translateX(-50%);

            color: white;

            font-size: 15px;

            background:
                rgba(0,0,0,.65);

            padding:
                6px 14px;

            border-radius: 20px;

            white-space: nowrap;

        }


        .car-thumbnails button.active {

            outline:
                3px solid #111;

            outline-offset:
                2px;

        }


        .main-car-image-wrapper {

            overflow: hidden;

            border-radius: 10px;

        }


        .main-car-image-wrapper img {

            width: 100%;

            display: block;

        }


        @media (max-width: 700px) {

            .gallery-content {

                width: 94vw;

                height: 72vh;

            }


            .gallery-prev,
            .gallery-next {

                width: 42px;

                height: 55px;

                font-size: 23px;

            }


            .gallery-prev {

                right: 8px;

            }


            .gallery-next {

                left: 8px;

            }


            .gallery-close {

                top: 10px;

                right: 10px;

            }

        }

    `;


    document.head.appendChild(style);

}


/* =========================================================
   INSPECTION MODAL
========================================================= */

function openInspectionModal(carId) {

    const modal =
        document.getElementById(
            "inspectionModal"
        );


    const carIdInput =
        document.getElementById(
            "inspectionCarId"
        );


    if (!modal) {
        return;
    }


    if (carIdInput) {

        carIdInput.value =
            carId;

    }


    modal.classList.add("show");

}


function closeInspectionModal() {

    const modal =
        document.getElementById(
            "inspectionModal"
        );


    if (modal) {

        modal.classList.remove("show");

    }

}


/* =========================================================
   INSPECTION FORM
========================================================= */

function initializeInspectionForm() {

    const inspectionForm =
        document.getElementById(
            "inspectionForm"
        );


    if (!inspectionForm) {
        return;
    }


    inspectionForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const formData =
                new FormData(
                    inspectionForm
                );


            const data = {

                car_id:
                    formData.get("car_id"),

                buyer_name:
                    formData.get("buyer_name"),

                buyer_phone:
                    formData.get("buyer_phone")

            };


            try {

                const response =
                    await fetch(
                        "/api/inspection",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)

                        }
                    );


                const result =
                    await response.json();


                if (
                    !response.ok ||
                    !result.success
                ) {

                    throw new Error(
                        result.message ||
                        "حدث خطأ أثناء إرسال الطلب."
                    );

                }


                alert(
                    currentLanguage === "ar"
                        ? "تم إرسال طلب المعاينة بنجاح. سنتواصل معك قريبًا."
                        : "Inspection request sent successfully. We will contact you soon."
                );


                inspectionForm.reset();

                closeInspectionModal();

            }

            catch (error) {

                console.error(
                    "Inspection error:",
                    error
                );


                alert(
                    error.message ||
                    (
                        currentLanguage === "ar"
                            ? "حدث خطأ أثناء إرسال الطلب."
                            : "An error occurred."
                    )
                );

            }

        }
    );

}


/* =========================================================
   CLOSE INSPECTION MODAL
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "inspectionModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeInspectionModal();

        }

    }
);


/* =========================================================
   SELL CAR FORM
========================================================= */

function initializeSellCarForm() {

    const sellCarForm =
        document.getElementById(
            "sellCarForm"
        );


    if (!sellCarForm) {
        return;
    }


    sellCarForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const message =
                document.getElementById(
                    "formMessage"
                );


            const submitButton =
                sellCarForm.querySelector(
                    'button[type="submit"]'
                );


            if (message) {

                message.textContent =
                    currentLanguage === "ar"
                        ? "جاري إرسال البيانات..."
                        : "Sending data...";

                message.className =
                    "form-message";

            }


            if (submitButton) {

                submitButton.disabled =
                    true;

                submitButton.textContent =
                    currentLanguage === "ar"
                        ? "جاري الإرسال..."
                        : "Sending...";

            }


            try {

                const formData =
                    new FormData(
                        sellCarForm
                    );


                const response =
                    await fetch(
                        "/api/cars",
                        {

                            method: "POST",

                            body: formData

                        }
                    );


                const result =
                    await response.json();


                if (
                    !response.ok ||
                    !result.success
                ) {

                    throw new Error(
                        result.message ||
                        (
                            currentLanguage === "ar"
                                ? "حدث خطأ أثناء حفظ العربية."
                                : "Could not save the car."
                        )
                    );

                }


                if (message) {

                    message.textContent =
                        currentLanguage === "ar"
                            ? "تم إرسال بيانات العربية بنجاح. سنتواصل معك لمراجعتها ومعاينتها."
                            : "Car information submitted successfully. We will contact you to review it.";

                    message.className =
                        "form-message success";

                }


                sellCarForm.reset();


                const preview =
                    document.getElementById(
                        "imagePreview"
                    );


                if (preview) {

                    preview.innerHTML =
                        "";

                }

            }

            catch (error) {

                console.error(
                    "Sell car error:",
                    error
                );


                if (message) {

                    message.textContent =
                        error.message ||
                        (
                            currentLanguage === "ar"
                                ? "حدث خطأ أثناء إرسال البيانات."
                                : "An error occurred while submitting the car."
                        );

                    message.className =
                        "form-message error";

                }

            }

            finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        currentLanguage === "ar"
                            ? "إرسال بيانات العربية"
                            : "Submit Car";

                }

            }

        }
    );

}


/* =========================================================
   IMAGE PREVIEW
========================================================= */

function initializeImagePreview() {

    const imageInput =
        document.querySelector(
            'input[name="images"]'
        );


    const preview =
        document.getElementById(
            "imagePreview"
        );


    if (
        !imageInput ||
        !preview
    ) {
        return;
    }


    imageInput.addEventListener(
        "change",
        function () {

            preview.innerHTML =
                "";


            const files =
                Array.from(
                    imageInput.files || []
                );


            files.forEach(
                (file, index) => {

                    if (
                        !file.type.startsWith(
                            "image/"
                        )
                    ) {
                        return;
                    }


                    const reader =
                        new FileReader();


                    reader.onload =
                        function (event) {

                            const wrapper =
                                document.createElement(
                                    "div"
                                );


                            wrapper.style.cssText = `
                                position:relative;
                                width:120px;
                                height:90px;
                                overflow:hidden;
                                border-radius:8px;
                            `;


                            wrapper.innerHTML = `

                                <img
                                    src="${event.target.result}"
                                    alt="Preview ${index + 1}"
                                    style="
                                        width:100%;
                                        height:100%;
                                        object-fit:cover;
                                    "
                                >

                            `;


                            preview.appendChild(
                                wrapper
                            );

                        };


                    reader.readAsDataURL(
                        file
                    );

                }
            );

        }
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   INITIALIZE EVERYTHING
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* Language */

        const languageButton =
            document.getElementById(
                "languageBtn"
            );


        if (languageButton) {

            languageButton.addEventListener(
                "click",
                toggleLanguage
            );

        }


        /* Apply language */

        applyLanguage();


        /* Cars page */

        loadCars();


        /* Car details page */

        loadCarDetails();


        /* Inspection */

        initializeInspectionForm();


        /* Sell car */

        initializeSellCarForm();


        /* Image preview */

        initializeImagePreview();

    }
);