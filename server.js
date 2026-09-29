const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const app = express();

/* =========================================================
   SERVER PORT
========================================================= */

const PORT = process.env.PORT || 3000;

/* =========================================================
   PATHS
========================================================= */

const websiteFolder = __dirname;

const imagesFolder = path.join(
    websiteFolder,
    "images"
);

const databasePath = path.join(
    websiteFolder,
    "database.db"
);

/* =========================================================
   CREATE IMAGES FOLDER
========================================================= */

if (!fs.existsSync(imagesFolder)) {
    fs.mkdirSync(imagesFolder, {
        recursive: true
    });
}

/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

/* =========================================================
   STATIC WEBSITE
========================================================= */

app.use(
    express.static(websiteFolder)
);

/* =========================================================
   DATABASE
========================================================= */

const db = new sqlite3.Database(
    databasePath,
    (error) => {

        if (error) {

            console.error(
                "Database connection error:",
                error.message
            );

        } else {

            console.log(
                "Database connected successfully."
            );

        }

    }
);

/* =========================================================
   FOREIGN KEYS
========================================================= */

db.run(
    "PRAGMA foreign_keys = ON",
    (error) => {

        if (error) {

            console.error(
                "Foreign keys error:",
                error.message
            );

        }

    }
);

/* =========================================================
   DATABASE TABLES
========================================================= */

db.serialize(() => {

    /* =====================================================
       CARS
    ===================================================== */

    db.run(`
        CREATE TABLE IF NOT EXISTS cars (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            brand TEXT NOT NULL,

            model TEXT NOT NULL,

            year INTEGER NOT NULL,

            mileage INTEGER,

            price INTEGER,

            transmission TEXT,

            condition TEXT,

            traffic_department TEXT,

            license_remaining TEXT,

            description TEXT,

            seller_name TEXT NOT NULL,

            seller_phone TEXT NOT NULL,

            car_location TEXT NOT NULL,

            status TEXT DEFAULT 'available',

            created_at DATETIME
                DEFAULT CURRENT_TIMESTAMP

        )
    `);


    /* =====================================================
       CAR IMAGES
    ===================================================== */

    db.run(`
        CREATE TABLE IF NOT EXISTS car_images (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            car_id INTEGER NOT NULL,

            image_path TEXT NOT NULL,

            created_at DATETIME
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (car_id)
                REFERENCES cars(id)
                ON DELETE CASCADE

        )
    `);


    /* =====================================================
       INSPECTION REQUESTS
    ===================================================== */

    db.run(`
        CREATE TABLE IF NOT EXISTS inspection_requests (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            car_id INTEGER NOT NULL,

            buyer_name TEXT NOT NULL,

            buyer_phone TEXT NOT NULL,

            status TEXT NOT NULL DEFAULT 'new',

            created_at DATETIME
                DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (car_id)
                REFERENCES cars(id)
                ON DELETE CASCADE

        )
    `);

    /* =====================================================
       MIGRATE OLD INSPECTION REQUESTS
       Adds status to existing databases without deleting data.
    ===================================================== */

    db.all(
        "PRAGMA table_info(inspection_requests)",
        (tableError, columns) => {

            if (tableError) {

                console.error(
                    "Inspection requests schema check error:",
                    tableError.message
                );

                return;

            }

            const hasStatus =
                (columns || []).some(
                    column => column.name === "status"
                );

            if (!hasStatus) {

                db.run(
                    "ALTER TABLE inspection_requests ADD COLUMN status TEXT NOT NULL DEFAULT 'new'",
                    (alterError) => {

                        if (alterError) {

                            console.error(
                                "Inspection requests migration error:",
                                alterError.message
                            );

                        } else {

                            console.log(
                                "Inspection requests status column added."
                            );

                        }

                    }
                );

            }

        }
    );

    db.run(`
        CREATE TABLE IF NOT EXISTS customers (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            phone TEXT NOT NULL UNIQUE,

            password TEXT NOT NULL,

            created_at DATETIME
                DEFAULT CURRENT_TIMESTAMP

        )
    `);


});

/* =========================================================
   MULTER STORAGE
========================================================= */

const storage = multer.diskStorage({

    destination: function (
        req,
        file,
        cb
    ) {

        cb(
            null,
            imagesFolder
        );

    },

    filename: function (
        req,
        file,
        cb
    ) {

        const extension =
            path.extname(
                file.originalname
            ).toLowerCase();

        const uniqueName =
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 12);

        cb(
            null,
            uniqueName + extension
        );

    }

});

/* =========================================================
   MULTER UPLOAD
========================================================= */

const upload = multer({

    storage: storage,

    limits: {

        fileSize:
            10 * 1024 * 1024,

        files: 20

    },

    fileFilter: function (
        req,
        file,
        cb
    ) {

        const allowedTypes = [

            "image/jpeg",

            "image/jpg",

            "image/png",

            "image/webp"

        ];

        if (
            allowedTypes.includes(
                file.mimetype
            )
        ) {

            cb(
                null,
                true
            );

        } else {

            cb(
                new Error(
                    "Only JPG, JPEG, PNG and WEBP images are allowed."
                )
            );

        }

    }

});

/* =========================================================
   HOME
========================================================= */

app.get(
    "/",
    (req, res) => {

        res.sendFile(
            path.join(
                websiteFolder,
                "index.html"
            )
        );

    }
);

/* =========================================================
   PUBLIC - ALL CARS
========================================================= */

app.get(
    "/api/cars",
    (req, res) => {

        db.all(
            `
            SELECT

                id,

                brand,

                model,

                year,

                mileage,

                price,

                transmission,

                condition,

                traffic_department,

                license_remaining,

                description,

                status,

                created_at

            FROM cars

            WHERE status = 'available'

            ORDER BY id DESC
            `,
            [],
            (error, cars) => {

                if (error) {

                    console.error(
                        "Load cars error:",
                        error.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Could not load cars."

                    });

                }

                if (
                    !cars ||
                    cars.length === 0
                ) {

                    return res.json({

                        success: true,

                        cars: []

                    });

                }

                let completed = 0;

                const carsWithImages = [];


                cars.forEach(
                    (car) => {

                        db.all(
                            `
                            SELECT

                                id,

                                image_path

                            FROM car_images

                            WHERE car_id = ?

                            ORDER BY id ASC
                            `,
                            [car.id],
                            (
                                imageError,
                                images
                            ) => {

                                if (imageError) {

                                    console.error(
                                        "Load images error:",
                                        imageError.message
                                    );

                                    return res.status(500).json({

                                        success: false,

                                        message:
                                            "Could not load car images."

                                    });

                                }

                                car.images =
                                    (images || []).map(
                                        image =>
                                            image.image_path
                                    );

                                car.main_image =
                                    car.images.length > 0
                                        ? car.images[0]
                                        : null;

                                carsWithImages.push(
                                    car
                                );

                                completed++;


                                if (
                                    completed ===
                                    cars.length
                                ) {

                                    carsWithImages.sort(
                                        (
                                            first,
                                            second
                                        ) =>
                                            second.id -
                                            first.id
                                    );

                                    return res.json({

                                        success: true,

                                        cars:
                                            carsWithImages

                                    });

                                }

                            }
                        );

                    }
                );

            }
        );

    }
);

/* =========================================================
   PUBLIC - SINGLE CAR
========================================================= */

app.get(
    "/api/cars/:id",
    (req, res) => {

        const carId =
            Number(
                req.params.id
            );


        if (
            !Number.isInteger(carId) ||
            carId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid car ID."

            });

        }


        db.get(
            `
            SELECT

                id,

                brand,

                model,

                year,

                mileage,

                price,

                transmission,

                condition,

                traffic_department,

                license_remaining,

                description,

                status,

                created_at

            FROM cars

            WHERE id = ?

              AND status = 'available'
            `,
            [carId],
            (error, car) => {

                if (error) {

                    console.error(
                        "Load car error:",
                        error.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Could not load car."

                    });

                }


                if (!car) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Car not found."

                    });

                }


                db.all(
                    `
                    SELECT

                        id,

                        image_path

                    FROM car_images

                    WHERE car_id = ?

                    ORDER BY id ASC
                    `,
                    [carId],
                    (
                        imageError,
                        images
                    ) => {

                        if (imageError) {

                            console.error(
                                "Load car images error:",
                                imageError.message
                            );

                            return res.status(500).json({

                                success: false,

                                message:
                                    "Could not load car images."

                            });

                        }


                        car.images =
                            (images || []).map(
                                image =>
                                    image.image_path
                            );


                        car.main_image =
                            car.images.length > 0
                                ? car.images[0]
                                : null;


                        return res.json({

                            success: true,

                            car: car

                        });

                    }
                );

            }
        );

    }
);

/* =========================================================
   PUBLIC - INSPECTION REQUEST
========================================================= */

app.post(
    "/api/inspection",
    (req, res) => {

        const {
            car_id,
            buyer_name,
            buyer_phone
        } = req.body;


        const carId =
            Number(car_id);


        if (
            !Number.isInteger(carId) ||
            carId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid car ID."

            });

        }


        if (
            !buyer_name ||
            !buyer_phone
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Name and phone are required."

            });

        }


        db.get(
            `
            SELECT id

            FROM cars

            WHERE id = ?

              AND status = 'available'
            `,
            [carId],
            (carError, car) => {

                if (carError) {

                    console.error(
                        "Inspection car check error:",
                        carError.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Could not verify car."

                    });

                }


                if (!car) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Car not found."

                    });

                }


                db.run(
                    `
                    INSERT INTO inspection_requests (

                        car_id,

                        buyer_name,

                        buyer_phone

                    )

                    VALUES (?, ?, ?)
                    `,
                    [
                        carId,

                        String(
                            buyer_name
                        ).trim(),

                        String(
                            buyer_phone
                        ).trim()

                    ],
                    function (error) {

                        if (error) {

                            console.error(
                                "Inspection request error:",
                                error.message
                            );

                            return res.status(500).json({

                                success: false,

                                message:
                                    "Could not create inspection request."

                            });

                        }


                        return res.status(201).json({

                            success: true,

                            message:
                                "Inspection request submitted successfully.",

                            request_id:
                                this.lastID

                        });

                    }
                );

            }
        );

    }
);

/* =========================================================
   ADMIN AUTHENTICATION
========================================================= */

function adminAuthentication(
    req,
    res,
    next
) {

    const password =
        req.headers[
            "x-admin-password"
        ];


    if (
        password !==
        "Zizo@2026"
    ) {

        return res.status(401).json({

            success: false,

            message:
                "Unauthorized."

        });

    }


    next();

}

/* =========================================================
   ADMIN - GET ALL CARS
========================================================= */

app.get(
    "/api/admin/cars",
    adminAuthentication,
    (req, res) => {

        db.all(
            `
            SELECT *

            FROM cars

            ORDER BY id DESC
            `,
            [],
            (error, cars) => {

                if (error) {

                    console.error(
                        "Admin cars error:",
                        error.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Could not load cars."

                    });

                }


                if (
                    !cars ||
                    cars.length === 0
                ) {

                    return res.json({

                        success: true,

                        cars: []

                    });

                }


                let completed = 0;

                const carsWithImages = [];


                cars.forEach(
                    (car) => {

                        db.all(
                            `
                            SELECT

                                id,

                                image_path

                            FROM car_images

                            WHERE car_id = ?

                            ORDER BY id ASC
                            `,
                            [car.id],
                            (
                                imageError,
                                images
                            ) => {

                                if (imageError) {

                                    console.error(
                                        "Admin images error:",
                                        imageError.message
                                    );

                                    return res.status(500).json({

                                        success: false,

                                        message:
                                            "Could not load images."

                                    });

                                }


                                car.images =
                                    (images || []).map(
                                        image =>
                                            image.image_path
                                    );


                                carsWithImages.push(
                                    car
                                );

                                completed++;


                                if (
                                    completed ===
                                    cars.length
                                ) {

                                    carsWithImages.sort(
                                        (
                                            first,
                                            second
                                        ) =>
                                            second.id -
                                            first.id
                                    );


                                    return res.json({

                                        success: true,

                                        cars:
                                            carsWithImages

                                    });

                                }

                            }
                        );

                    }
                );

            }
        );

    }
);

/* =========================================================
   ADMIN - GET ALL INSPECTION REQUESTS
========================================================= */

app.get(
    "/api/admin/requests",
    adminAuthentication,
    (req, res) => {

        db.all(
            `
            SELECT

                inspection_requests.id,

                inspection_requests.car_id,

                inspection_requests.buyer_name,

                inspection_requests.buyer_phone,

                inspection_requests.status,

                inspection_requests.created_at,

                cars.brand,

                cars.model,

                cars.year,

                cars.seller_name,

                cars.seller_phone,

                cars.car_location

            FROM inspection_requests

            LEFT JOIN cars

                ON cars.id =
                   inspection_requests.car_id

            ORDER BY
                inspection_requests.id DESC
            `,
            [],
            (error, requests) => {

                if (error) {

                    console.error(
                        "Admin requests error:",
                        error.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Could not load requests."

                    });

                }


                return res.json({

                    success: true,

                    requests:
                        requests || []

                });

            }
        );

    }
);

/* =========================================================
   ADMIN - ADD CAR
========================================================= */

app.post(
    "/api/admin/cars",
    adminAuthentication,
    upload.array(
        "images",
        20
    ),
    (req, res) => {

        const {

            brand,

            model,

            year,

            mileage,

            price,

            transmission,

            condition,

            traffic_department,

            license_remaining,

            description,

            seller_name,

            seller_phone,

            car_location

        } = req.body;


        if (
            !brand ||
            !model ||
            !year ||
            !seller_name ||
            !seller_phone ||
            !car_location
        ) {

            if (
                req.files &&
                req.files.length
            ) {

                req.files.forEach(
                    file => {

                        try {

                            fs.unlinkSync(
                                file.path
                            );

                        }
                        catch (
                            cleanupError
                        ) {

                            console.error(
                                "Cleanup error:",
                                cleanupError.message
                            );

                        }

                    }
                );

            }


            return res.status(400).json({

                success: false,

                message:
                    "Required fields are missing."

            });

        }


        const numericYear =
            Number(year);


        if (
            !Number.isInteger(
                numericYear
            )
        ) {

            if (
                req.files &&
                req.files.length
            ) {

                req.files.forEach(
                    file => {

                        try {

                            fs.unlinkSync(
                                file.path
                            );

                        }
                        catch (
                            cleanupError
                        ) {

                            console.error(
                                "Cleanup error:",
                                cleanupError.message
                            );

                        }

                    }
                );

            }


            return res.status(400).json({

                success: false,

                message:
                    "Invalid year."

            });

        }


        db.run(
            `
            INSERT INTO cars (

                brand,

                model,

                year,

                mileage,

                price,

                transmission,

                condition,

                traffic_department,

                license_remaining,

                description,

                seller_name,

                seller_phone,

                car_location,

                status

            )

            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')
            `,
            [

                String(
                    brand
                ).trim(),

                String(
                    model
                ).trim(),

                numericYear,

                mileage
                    ? Number(mileage)
                    : null,

                price
                    ? Number(price)
                    : null,

                transmission
                    ? String(transmission).trim()
                    : null,

                condition
                    ? String(condition).trim()
                    : null,

                traffic_department
                    ? String(traffic_department).trim()
                    : null,

                license_remaining
                    ? String(license_remaining).trim()
                    : null,

                description
                    ? String(description).trim()
                    : null,

                String(
                    seller_name
                ).trim(),

                String(
                    seller_phone
                ).trim(),

                String(
                    car_location
                ).trim()

            ],
            function (error) {

                if (error) {

                    console.error(
                        "Add car error:",
                        error.message
                    );


                    if (
                        req.files &&
                        req.files.length
                    ) {

                        req.files.forEach(
                            file => {

                                try {

                                    fs.unlinkSync(
                                        file.path
                                    );

                                }
                                catch (
                                    cleanupError
                                ) {

                                    console.error(
                                        "Cleanup error:",
                                        cleanupError.message
                                    );

                                }

                            }
                        );

                    }


                    return res.status(500).json({

                        success: false,

                        message:
                            "Could not add car."

                    });

                }


                const carId =
                    this.lastID;


                if (
                    !req.files ||
                    req.files.length === 0
                ) {

                    return res.status(201).json({

                        success: true,

                        message:
                            "Car added successfully.",

                        car_id:
                            carId

                    });

                }


                const placeholders =
                    req.files
                        .map(
                            () =>
                                "(?, ?)"
                        )
                        .join(",");


                const values = [];


                req.files.forEach(
                    file => {

                        values.push(
                            carId
                        );

                        values.push(
                            "/images/" +
                            file.filename
                        );

                    }
                );


                db.run(
                    `
                    INSERT INTO car_images (

                        car_id,

                        image_path

                    )

                    VALUES ${placeholders}
                    `,
                    values,
                    function (imageError) {

                        if (imageError) {

                            console.error(
                                "Add car images error:",
                                imageError.message
                            );

                            return res.status(500).json({

                                success: false,

                                message:
                                    "Car added but images could not be saved."

                            });

                        }


                        return res.status(201).json({

                            success: true,

                            message:
                                "Car added successfully.",

                            car_id:
                                carId

                        });

                    }
                );

            }
        );

    }
);

/* =========================================================
   ADMIN - UPDATE CAR
========================================================= */

app.put(
    "/api/admin/cars/:id",
    adminAuthentication,
    upload.array(
        "images",
        20
    ),
    (req, res) => {

        const carId =
            Number(
                req.params.id
            );


        if (
            !Number.isInteger(carId) ||
            carId <= 0
        ) {

            if (
                req.files &&
                req.files.length
            ) {

                req.files.forEach(
                    file => {

                        try {

                            fs.unlinkSync(
                                file.path
                            );

                        }
                        catch (
                            cleanupError
                        ) {

                            console.error(
                                "Cleanup error:",
                                cleanupError.message
                            );

                        }

                    }
                );

            }


            return res.status(400).json({

                success: false,

                message:
                    "Invalid car ID."

            });

        }


        const {

            brand,

            model,

            year,

            mileage,

            price,

            transmission,

            condition,

            traffic_department,

            license_remaining,

            description,

            seller_name,

            seller_phone,

            car_location,

            status

        } = req.body;


        if (
            !brand ||
            !model ||
            !year ||
            !seller_name ||
            !seller_phone ||
            !car_location
        ) {

            if (
                req.files &&
                req.files.length
            ) {

                req.files.forEach(
                    file => {

                        try {

                            fs.unlinkSync(
                                file.path
                            );

                        }
                        catch (
                            cleanupError
                        ) {

                            console.error(
                                "Cleanup error:",
                                cleanupError.message
                            );

                        }

                    }
                );

            }


            return res.status(400).json({

                success: false,

                message:
                    "Required fields are missing."

            });

        }


        const numericYear =
            Number(year);


        if (
            !Number.isInteger(
                numericYear
            )
        ) {

            if (
                req.files &&
                req.files.length
            ) {

                req.files.forEach(
                    file => {

                        try {

                            fs.unlinkSync(
                                file.path
                            );

                        }
                        catch (
                            cleanupError
                        ) {

                            console.error(
                                "Cleanup error:",
                                cleanupError.message
                            );

                        }

                    }
                );

            }


            return res.status(400).json({

                success: false,

                message:
                    "Invalid year."

            });

        }


        db.get(
            `
            SELECT *

            FROM cars

            WHERE id = ?
            `,
            [carId],
            (findError, existingCar) => {

                if (findError) {

                    console.error(
                        "Find car error:",
                        findError.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Could not load car."

                    });

                }


                if (!existingCar) {

                    if (
                        req.files &&
                        req.files.length
                    ) {

                        req.files.forEach(
                            file => {

                                try {

                                    fs.unlinkSync(
                                        file.path
                                    );

                                }
                                catch (
                                    cleanupError
                                ) {

                                    console.error(
                                        "Cleanup error:",
                                        cleanupError.message
                                    );

                                }

                            }
                        );

                    }


                    return res.status(404).json({

                        success: false,

                        message:
                            "Car not found."

                    });

                }


                db.run(
                    `
                    UPDATE cars

                    SET

                        brand = ?,

                        model = ?,

                        year = ?,

                        mileage = ?,

                        price = ?,

                        transmission = ?,

                        condition = ?,

                        traffic_department = ?,

                        license_remaining = ?,

                        description = ?,

                        seller_name = ?,

                        seller_phone = ?,

                        car_location = ?,

                        status = ?

                    WHERE id = ?
                    `,
                    [

                        String(
                            brand
                        ).trim(),

                        String(
                            model
                        ).trim(),

                        numericYear,

                        mileage
                            ? Number(mileage)
                            : null,

                        price
                            ? Number(price)
                            : null,

                        transmission
                            ? String(transmission).trim()
                            : null,

                        condition
                            ? String(condition).trim()
                            : null,

                        traffic_department
                            ? String(traffic_department).trim()
                            : null,

                        license_remaining
                            ? String(license_remaining).trim()
                            : null,

                        description
                            ? String(description).trim()
                            : null,

                        String(
                            seller_name
                        ).trim(),

                        String(
                            seller_phone
                        ).trim(),

                        String(
                            car_location
                        ).trim(),

                        status
                            ? String(status).trim()
                            : "available",

                        carId

                    ],
                    function (error) {

                        if (error) {

                            console.error(
                                "Update car error:",
                                error.message
                            );

                            if (
                                req.files &&
                                req.files.length
                            ) {

                                req.files.forEach(
                                    file => {

                                        try {

                                            fs.unlinkSync(
                                                file.path
                                            );

                                        }
                                        catch (
                                            cleanupError
                                        ) {

                                            console.error(
                                                "Cleanup error:",
                                                cleanupError.message
                                            );

                                        }

                                    }
                                );

                            }


                            return res.status(500).json({

                                success: false,

                                message:
                                    "Could not update car."

                            });

                        }


                        if (
                            !req.files ||
                            req.files.length === 0
                        ) {

                            return res.json({

                                success: true,

                                message:
                                    "Car updated successfully."

                            });

                        }


                        const placeholders =
                            req.files
                                .map(
                                    () =>
                                        "(?, ?)"
                                )
                                .join(",");


                        const values = [];


                        req.files.forEach(
                            file => {

                                values.push(
                                    carId
                                );

                                values.push(
                                    "/images/" +
                                    file.filename
                                );

                            }
                        );


                        db.run(
                            `
                            INSERT INTO car_images (

                                car_id,

                                image_path

                            )

                            VALUES ${placeholders}
                            `,
                            values,
                            function (
                                imageError
                            ) {

                                if (
                                    imageError
                                ) {

                                    console.error(
                                        "Update images error:",
                                        imageError.message
                                    );

                                    return res.status(500).json({

                                        success: false,

                                        message:
                                            "Car updated but images could not be saved."

                                    });

                                }


                                return res.json({

                                    success: true,

                                    message:
                                        "Car updated successfully."

                                });

                            }
                        );

                    }
                );

            }
        );

    }
);

/* =========================================================
   ADMIN - DELETE CAR
========================================================= */

app.delete(
    "/api/admin/cars/:id",
    adminAuthentication,
    (req, res) => {

        const carId =
            Number(
                req.params.id
            );


        if (
            !Number.isInteger(carId) ||
            carId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid car ID."

            });

        }


        db.all(
            `
            SELECT

                image_path

            FROM car_images

            WHERE car_id = ?
            `,
            [carId],
            (imageError, images) => {

                if (imageError) {

                    console.error(
                        "Delete images lookup error:",
                        imageError.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Could not load car images."

                    });

                }


                db.run(
                    `
                    DELETE FROM cars

                    WHERE id = ?
                    `,
                    [carId],
                    function (error) {

                        if (error) {

                            console.error(
                                "Delete car error:",
                                error.message
                            );

                            return res.status(500).json({

                                success: false,

                                message:
                                    "Could not delete car."

                            });

                        }


                        if (
                            this.changes === 0
                        ) {

                            return res.status(404).json({

                                success: false,

                                message:
                                    "Car not found."

                            });

                        }


                        (images || []).forEach(
                            image => {

                                const filename =
                                    path.basename(
                                        image.image_path
                                    );


                                const fullPath =
                                    path.join(
                                        imagesFolder,
                                        filename
                                    );


                                if (
                                    fs.existsSync(
                                        fullPath
                                    )
                                ) {

                                    try {

                                        fs.unlinkSync(
                                            fullPath
                                        );

                                    }
                                    catch (
                                        deleteImageError
                                    ) {

                                        console.error(
                                            "Image delete error:",
                                            deleteImageError.message
                                        );

                                    }

                                }

                            }
                        );


                        return res.json({

                            success: true,

                            message:
                                "Car and all images deleted successfully."

                        });

                    }
                );

            }
        );

    }
);

/* =========================================================
   ADMIN - UPDATE INSPECTION REQUEST STATUS
========================================================= */

app.put(
    "/api/admin/requests/:id/status",
    adminAuthentication,
    (req, res) => {

        const requestId =
            Number(
                req.params.id
            );

        if (
            !Number.isInteger(requestId) ||
            requestId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid request ID."

            });

        }

        const allowedStatuses = [
            "new",
            "contacted",
            "completed"
        ];

        const status =
            String(
                req.body.status || ""
            )
            .trim()
            .toLowerCase();

        if (
            !allowedStatuses.includes(
                status
            )
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid request status."

            });

        }

        db.run(
            `
            UPDATE inspection_requests

            SET status = ?

            WHERE id = ?
            `,
            [
                status,
                requestId
            ],
            function (error) {

                if (error) {

                    console.error(
                        "Update request status error:",
                        error.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Could not update request status."

                    });

                }

                if (
                    this.changes === 0
                ) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Request not found."

                    });

                }

                return res.json({

                    success: true,

                    message:
                        "Request status updated successfully.",

                    status:
                        status

                });

            }
        );

    }
);


/* =========================================================
   ADMIN - DELETE INSPECTION REQUEST
========================================================= */

app.delete(
    "/api/admin/requests/:id",
    adminAuthentication,
    (req, res) => {

        const requestId =
            Number(
                req.params.id
            );


        if (
            !Number.isInteger(requestId) ||
            requestId <= 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid request ID."

            });

        }


        db.run(
            `
            DELETE FROM inspection_requests

            WHERE id = ?
            `,
            [requestId],
            function (error) {

                if (error) {

                    console.error(
                        "Delete request error:",
                        error.message
                    );

                    return res.status(500).json({

                        success: false,

                        message:
                            "Could not delete request."

                    });

                }


                if (
                    this.changes === 0
                ) {

                    return res.status(404).json({

                        success: false,

                        message:
                            "Request not found."

                    });

                }


                return res.json({

                    success: true,

                    message:
                        "Request deleted successfully."

                });

            }
        );

    }
);

/* =========================================================
   CUSTOMER AUTHENTICATION
========================================================= */

function hashCustomerPassword(password) {
    return crypto
        .createHash("sha256")
        .update(password, "utf8")
        .digest("hex");
}

/* CUSTOMER - REGISTER */
app.post(
    "/api/customer/register",
    (req, res) => {

        const {
            name,
            phone,
            password
        } = req.body;

        if (
            !name ||
            !phone ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Please complete all fields."
            });
        }

        const cleanName = String(name).trim();
        const cleanPhone = String(phone).trim();
        const cleanPassword = String(password);

        if (
            cleanName.length < 2 ||
            cleanPhone.length < 6 ||
            cleanPassword.length < 6
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, phone and password are invalid."
            });
        }

        const passwordHash =
            hashCustomerPassword(cleanPassword);

        db.run(
            `
                INSERT INTO customers (
                    name,
                    phone,
                    password
                )
                VALUES (?, ?, ?)
            `,
            [
                cleanName,
                cleanPhone,
                passwordHash
            ],
            function (error) {

                if (error) {

                    console.error(
                        "Customer register error:",
                        error.message
                    );

                    if (
                        error.message.includes(
                            "UNIQUE constraint failed"
                        )
                    ) {
                        return res.status(409).json({
                            success: false,
                            message: "This phone number is already registered."
                        });
                    }

                    return res.status(500).json({
                        success: false,
                        message: "Could not create customer account."
                    });
                }

                return res.status(201).json({
                    success: true,
                    customer: {
                        id: this.lastID,
                        name: cleanName,
                        phone: cleanPhone
                    },
                    message: "Account created successfully."
                });
            }
        );
    }
);

/* CUSTOMER - LOGIN */
app.post(
    "/api/customer/login",
    (req, res) => {

        const {
            phone,
            password
        } = req.body;

        if (
            !phone ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Phone and password are required."
            });
        }

        const cleanPhone = String(phone).trim();
        const passwordHash =
            hashCustomerPassword(String(password));

        db.get(
            `
                SELECT
                    id,
                    name,
                    phone
                FROM customers
                WHERE phone = ?
                  AND password = ?
            `,
            [
                cleanPhone,
                passwordHash
            ],
            (error, customer) => {

                if (error) {

                    console.error(
                        "Customer login error:",
                        error.message
                    );

                    return res.status(500).json({
                        success: false,
                        message: "Database error."
                    });
                }

                if (!customer) {
                    return res.status(401).json({
                        success: false,
                        message: "Invalid phone number or password."
                    });
                }

                return res.json({
                    success: true,
                    customer: customer,
                    message: "Login successful."
                });
            }
        );
    }
);

/* =========================================================
   API 404
========================================================= */

app.use(
    "/api",
    (req, res) => {

        return res.status(404).json({

            success: false,

            message:
                "API endpoint not found."

        });

    }
);

/* =========================================================
   ERROR HANDLER
========================================================= */

app.use(
    (
        error,
        req,
        res,
        next
    ) => {

        console.error(
            "Server error:",
            error.message
        );


        if (
            error instanceof
            multer.MulterError
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Image upload error: " +
                    error.message

            });

        }


        if (error) {

            return res.status(400).json({

                success: false,

                message:
                    error.message

            });

        }


        next();

    }
);

/* =========================================================
   START SERVER
========================================================= */

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log("");

        console.log(
            "===================================="
        );

        console.log(
            "          ZIZO AUTOMOTIVE"
        );

        console.log(
            "===================================="
        );

        console.log(
            "Server running on:"
        );

        console.log(
            `http://localhost:${PORT}`
        );

        console.log(
            "===================================="
        );

        console.log("");

    }
);
