exports.getProducts = (req, res, next) => {
  res.status(200).json({
    products: [
      {
        id: 1,
        title: "Leader Bag",
        description: "A bag that protects you from danger",
        price: 29.99,
        image:
          "https://images.unsplash.com/photo-1502255140135-ee0e0a0ee0e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format",
      },
      {
        id: 2,
        title: "Skin Bag",
        description: "A bag that protects you from danger",
        price: 22.99,
        image:
          "https://images.unsplash.com/photo-1502255140135-ee0e0a0ee0e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format",
      },
      {
        id: 3,
        title: "Wallet",
        description: "A bag that protects you from danger",
        price: 19.99,
        image:
          "https://images.unsplash.com/photo-1502255140135-ee0e0a0ee0e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format",
      },
    ],
  });
};

exports.getCredentials = (req, res, next) => {
  const { email, password } = req.body;
  // verify details with credential stored in database
  if (email === "poise@gmail.com" && password === "rexxiepoise") {
    res.status(200).json({
      message: "Login successful",
    });
  } else {
    res.status(401).json({
      message: "Invalid credentials",
    });
  }
};

exports.postProduct = (req, res, next) => {
  // destructure the body object
  const { title, description, price, image } = req.body;
  // insert product into database
  // check if the above details is present in the body
  if (title && description && price && image) {
    res.status(201).json({
      message: "Product added successfully",
      post: {
        id: new Date().toISOString(),
        title,
        description,
        price,
        image,
      },
    });
  } else {
    res
      .status(400)
      .json({ message: "bad payload, kindly check submitted data" });
  }
};
