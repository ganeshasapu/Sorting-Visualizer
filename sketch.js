// Main array to store info of each pixel
boxPixels = []
imageCounter = 0
sorting = false
shuffled = false
iterPerFrameCounter = 0
pixelAmount = 25
totalPixels = 625

// Default Soring method
sortMethod = "Bubble"

let img;
let input;

// Generators for each sorting method - uses yield to continue from previous
// position in sorting functions
bubbleSortGen = bubbleSort()
selectionSortGen = selectionSort()
insertionSortGen = insertionSort()
mergeSortGen = mergeSort(boxPixels)
quickSortGen = quickSort(boxPixels, 0, (pixelAmount * pixelAmount) - 1, true)
heapSortGen = heapSort()
cycleSortGen = cycleSort()
cocktailSortGen = cocktailSort()
pancakeSortGen = pancakeSort()


// Dict to store refrence of each generator for ease of access
sortMethodDict = {
	"Bubble":bubbleSortGen,
	"Quick":quickSortGen,
	"Merge":mergeSortGen,
	"Heap":heapSortGen,
	"Insertion":insertionSortGen,
	"Selection":selectionSortGen,
	"Cocktail":cocktailSortGen,
	"Cycle":cycleSortGen,
	"Pancake":pancakeSortGen
}

function preload(){
	font = loadFont('gameFont.otf')
}

function sortMethodChanged(){
	// Function called when sorting method dropdown element is changed
	if (sorting){
		return
	}
	sortMethod = sortSel.value()
}

function sortButtonPressed(){
	// Function called when sort button is pressed
	console.log("Sorting...")
	if (shuffled){
		sorting = true
	}
	else {
		console.log("Shuffle and choose a sorting method first")
	}
}

function shuffleImage(){
	// Function used to shuffle array when shuffle button is pressed
	if (img && sorting == false){
		console.log("Shuffling...")
		shuffle(boxPixels, true)
		shuffled = true
	}
	else{
		console.log("Pick an image first...")
	}
}

function findStartIndex(arr){
	// Helper function for merge sort
	// Gets the index of the first element that appears in boxPixels that is also in array
  for (element of boxPixels){
    if (arr.includes(element)){
      return boxPixels.indexOf(element)
    }
  }
}

function findMax(arr, n){
	// Helper function for pancakeSort
	mi = 0
	for (i=0; i<n; i++){
		if (arr[i][4] > arr[mi][4]){
			mi = i
		}
	}
	return mi
}

function updatePixelAmount(){
	// Function used for slider
	pixelAmount = pixelSlider.value();
	boxPixels.length = 0
	for (n=0; n<(pixelAmount *  pixelAmount); n++){
		boxPixels.push([255, 255, 255, 255])
	}
}

function chooseNewImage(){
	// Function that is called when choose new image button is pressed
	img = null

	input = createFileInput(handleFile)
	input.position(275, height - 30)
	imageCounter = 0

	pixelSlider = createSlider(25, 75, 25, 1)
	pixelSlider.position(75, 420);
	pixelSlider.style('width', '600px');
	pixelSlider.input(updatePixelAmount);
	updatePixelAmount()

	boxPixels.length = 0
	for (n=0; n<625; n++){
		boxPixels.push([255, 255, 255, 255])
	}
}


function* bubbleSort(){
	// Traverses through array and switches elements if it's
	// greater. Sort stops when 1 full loop doesn't swap any
	// elements. O(n^2)
  if (img){
		while (true){
	    for (i=0; i<boxPixels.length; i++){
				swapped = false
	      for (j=0; j<boxPixels.length-i-1; j++){
	        if (boxPixels[j][4] > boxPixels[j + 1][4]){
	          temp = boxPixels[j]
	    			boxPixels[j] = boxPixels[j + 1]
	    			boxPixels[j + 1] = temp
						swapped = true
	        }
	      }
				iterPerFrameCounter += 1
				if (iterPerFrameCounter == floor(pixelAmount / 15)){
					iterPerFrameCounter = 0
					yield
				}
				if (swapped == false){
					break
				}
	    }
			sorting = false
			sortMethodChanged()
			shuffled = false
			yield
		}
  }
  else{
    console.log("Pick an image first...")
  }
}

function* partition(arr, low, high){
	// Used in quick sort to put arr elements
	i = low - 1
	pivot = arr[high]

	for (j=low; j<high; j++){
		if (arr[j][4] < pivot[4]){
			i++
			temp = arr[i]
			arr[i] = arr[j]
			arr[j] = temp
			iterPerFrameCounter += 1
			if (iterPerFrameCounter == floor(pixelAmount / 2.5)){
				iterPerFrameCounter = 0
				yield
			}
		}
	}
	temp = arr[i + 1]
	arr[i + 1] = arr[high]
	arr[high] = temp

	return i+1
}

function* quickSort(arr, low, high, first){
	// Recursive function. Picks an element, (this case it's the last element)
	// Puts smaller elements left of element, and bigger elements right of
	// element. O(log n)
	if (img){
		if (first){
			while (true){
				arr = boxPixels
				low = 0
				high = arr.length - 1
				if (low < high){
					pi = yield* partition(arr, low, high)

					yield* quickSort(arr, low, pi-1, false)
					yield* quickSort(arr, pi+1, high, false)

					sorting = false
					sortMethodChanged()
					shuffled = false
					iterPerFrameCounter = 0
					yield
				}
			}
		}
		else{
			if (low < high){
				pi = yield* partition(arr, low, high)

				yield* quickSort(arr, low, pi-1, false)
				yield* quickSort(arr, pi+1, high, false)
			}
		}
	}
	else{
    console.log("Pick an image first...")
  }
}

function* merge(arr1, arr2) {
	//Takes 2 arrays and combines them into 1 in a sorted order
  sorted = []
	combined = arr1.concat(arr2)

	combinedStart = findStartIndex(combined)
	combinedEnd = combinedStart + combined.length
	i = 0

  while (arr1.length && arr2.length) {
    if (arr1[0][4] < arr2[0][4]) {
      sorted.push(arr1[0]);
			arr1.shift()
    }
    else {
      sorted.push(arr2[0]);
			arr2.shift()
    }

		temp = combined[i]
		sIdx = combined.indexOf(sorted[i])
		combined[i] = sorted[i]
		combined[sIdx] = temp

		boxPixels = boxPixels.slice(0, combinedStart).concat(combined).concat(boxPixels.slice(combinedEnd))
		iterPerFrameCounter += 1
		if (iterPerFrameCounter == floor(pixelAmount / 2.5)){
			iterPerFrameCounter = 0
			yield
		}
		i += 1
  };

  return sorted.concat(arr1.concat(arr2));
};

function* mergeSort (arr){
	// Recursive function. Splits given array in half (creates left and right)
	// until array size reaches length 1 and then merges them together.
	// O(n log n)
	if (img){
		while (true){
			if (arr.length <= 1) {
		    return arr;
		  }
			let mid = floor(arr.length / 2)

			let left = arr.slice(0, mid)
			left = yield* mergeSort(left)

			let right = arr.slice(mid)
			right = yield* mergeSort(right)


			if (arr.length == boxPixels.length){
				console.log("Reached end")
				boxPixels = yield* merge(left, right)
				sorting = false
				sortMethodChanged()
				shuffled = false
				yield
				arr = boxPixels
			}
			else{
				a = yield* merge(left, right)
				return a
			}
		}
	}
	else{
    console.log("Pick an image first...")
  }
}

function* heapify(arr, n, i){
  largest = i
  l = (2*i) + 1
  r = (2*i) + 2

  if(l<n && arr[i][4] < arr[l][4]){
    largest = l
  }
  if (r<n && arr[r][4] > arr[largest][4]){
    largest = r
  }

  if (largest != i){
    swap = arr[i]
    arr[i] = arr[largest]
    arr[largest] = swap
		iterPerFrameCounter += 1
		if (iterPerFrameCounter == floor(pixelAmount / 2.5)){
			iterPerFrameCounter = 0
			yield
		}

    yield* heapify(arr, n, largest)
  }
}

function* heapSort(){
	// Uses a binary heap data structure. Builds a max heap, replaces the root
	// of the heap with the last element and reduces the size of the heap
	// by 1 and then heapifies the root.
	// O(n log n)
	if (img){
		while (true){
		  n = boxPixels.length
		  for (i=floor(n / 2) - 1; i>=0; i--){
		    yield* heapify(boxPixels, n, i)
		  }

		  for (i=n-1; i>0; i--){
		    temp = boxPixels[0]
		    boxPixels[0] = boxPixels[i]
		    boxPixels[i] = temp
		    yield* heapify(boxPixels, i, 0)
		  }

			sorting = false
			sortMethodChanged()
			shuffled = false
			iterPerFrameCounter = 0
			yield
		}
	}
}

function* insertionSort(){
	// Goes over each element of array and puts element into correct place by
	// going backwards until the previous element is smaller than current element.
	// O(n^2)
	if (img){
		while (true){
			for (i=1; i<boxPixels.length; i++){
				curPixel = boxPixels[i]
				j = i-1
				while (j>=0 && curPixel[4]<boxPixels[j][4]){
					boxPixels[j + 1] = boxPixels[j]
					j -= 1
				}
				boxPixels[j + 1] = curPixel
				iterPerFrameCounter += 1
				if (iterPerFrameCounter == floor(pixelAmount / 15)){
					iterPerFrameCounter = 0
					yield
				}
			}
			sorting = false
			sortMethodChanged()
			shuffled = false
			yield
		}
	}
	else{
    console.log("Pick an image first...")
  }
}

function* selectionSort(){
	// Goes through every element and finds minimum value and places it in the
	// front. Continue until entire array is sorted. O(n^2)
	if (img){
		while (true){
			for (i=0; i<boxPixels.length; i++){
				minIndex = i
				for (j=i+1; j<boxPixels.length; j++){
					if(boxPixels[minIndex][4] > boxPixels[j][4]){
						minIndex = j
					}
				}
				temp = boxPixels[i]
				boxPixels[i] = boxPixels[minIndex]
				boxPixels[minIndex] = temp
				iterPerFrameCounter += 1
				if (iterPerFrameCounter == floor(pixelAmount / 15)){
					iterPerFrameCounter = 0
					yield
				}
			}
			sorting = false
			sortMethodChanged()
			shuffled = false
		}
	}
	else{
    console.log("Pick an image first...")
  }
}

function* cocktailSort(){
	// Bubble sort except after going forward through the array, also go backwards.
	// O(n^2)
	if (img){
		while (true){
			swapped = true
			start = 0
			end = boxPixels.length

			while(swapped == true){
				swapped = false
				for (i=start;i<end-1;i++){
					if(boxPixels[i][4] > boxPixels[i + 1][4]){
						temp = boxPixels[i]
						boxPixels[i] = boxPixels[i + 1]
						boxPixels[i + 1] = temp
						swapped = true
					}
				}
				iterPerFrameCounter += 1
				if (iterPerFrameCounter == floor(pixelAmount / 15)){
					iterPerFrameCounter = 0
					yield
				}

				if (swapped == false){
					break
				}

				swapped = false

				end -= 1

				for (i = end-1; i >= start; i--){
					if (boxPixels[i][4] > boxPixels[i + 1][4]){
						temp = boxPixels[i]
						boxPixels[i] = boxPixels[i + 1]
						boxPixels[i + 1] = temp
						swapped = true
					}
				}
				iterPerFrameCounter += 1
				if (iterPerFrameCounter == floor(pixelAmount / 15)){
					iterPerFrameCounter = 0
					yield
				}

				start += 1
			}
			sorting = false
			sortMethodChanged()
			shuffled = false
			yield
		}
	}
	else{
    console.log("Pick an image first...")
  }
}

function* cycleSort(){
	// Makes the least amount of array changes. Find location of the element
	// needs to be in index 0 and puts element there. Then finds the location
	// of the element that needs to go into old location of the first element.
	// Continue till sorted. O(n^2)
	if (img){
		while (true){
			n = boxPixels.length
			for (cStart = 0; cStart <= n - 2; cStart++){
				item = boxPixels[cStart]

				pos = cStart
				for (i = cStart + 1; i < n; i++){
					if (boxPixels[i][4] < item[4]){
						pos++
					}
				}

				if (pos == cStart){
					continue
				}

				while (item[4] == boxPixels[pos][4]){
					pos++
				}

				if (pos != cStart){
					temp = item
					item = boxPixels[pos]
					boxPixels[pos] = temp
					iterPerFrameCounter += 1
					if (iterPerFrameCounter == floor(pixelAmount / 15)){
						iterPerFrameCounter = 0
						yield
					}
				}

				while (pos != cStart){
					pos = cStart

					for (i = cStart + 1; i < n; i++){
						if (boxPixels[i][4] < item[4]){
							pos += 1
						}
					}

					while(item == boxPixels[pos]){
						pos++
					}

					if (item != boxPixels[pos]){
						temp = item
						item = boxPixels[pos]
						boxPixels[pos] = temp
						iterPerFrameCounter += 1
						if (iterPerFrameCounter == floor(pixelAmount / 15)){
							iterPerFrameCounter = 0
							yield
						}
					}
				}
			}
			sorting = false
			sortMethodChanged()
			shuffled = false
			yield
		}
	}
	else{
    console.log("Pick an image first...")
  }
}

function* flip(arr, i){
	// Helper function for pancake sort.
	start = 0
	while (start < i){
		temp = arr[start]
		arr[start] = arr[i]
		arr[i] = temp
		start += 1
		i -= 1
		iterPerFrameCounter += 1
		if (iterPerFrameCounter == floor(pow(pixelAmount, 2))){
			iterPerFrameCounter = 0
			yield
		}
	}
}

function* pancakeSort(){
	// Sort based on the function "flip" that reverses a section of an array.
	// O(n^2).
	if (img){
		while (true){
			curSize = boxPixels.length
			while (curSize > 1){
				mi = findMax(boxPixels, curSize)

				if (mi != curSize-1){
					yield* flip(boxPixels, mi)
					yield* flip(boxPixels, curSize - 1)
				}
				curSize -= 1
			}
			sorting = false
			sortMethodChanged()
			shuffled = false
			yield
		}
	}

}


function changePixels(){
	// Called each frame to update image after sorting functions
	noStroke()
	for (n=0; n<pixelAmount * pixelAmount; n++){
		fill(boxPixels[n])

		x = n % pixelAmount
		y = floor(n / pixelAmount)

		scaleVal = 250 / pixelAmount

		align = (pixelAmount / 27)

		quad(x * scaleVal + 250, y * scaleVal + 125, x * scaleVal + 250 + scaleVal, y * scaleVal + 125, x * scaleVal + 250 + scaleVal, y * scaleVal + 125 + scaleVal, x * scaleVal + 250, y * scaleVal + 125 + scaleVal)
	}
}

function getPixels(){
	// Updates the boxPixels array after an image is uploaded
	img.resize(pixelAmount, pixelAmount)
	img.loadPixels()
	for (y=0; y<pixelAmount; y++){
		for (x=0; x<pixelAmount; x++){
			c = img.get(x, y)
			c.push(y * pixelAmount + x)
			boxPixels[y * pixelAmount + x] = c
		}
	}
	img.updatePixels()
}

function setup() {
	width = 750
	height = 500

	createCanvas(width, height)

	background(200)

	// Making boxPixels array
	for (n=0; n<625; n++){
		boxPixels.push([255, 255, 255, 255])
	}
	// File Input
  input = createFileInput(handleFile)
	input.position(275, height - 30)

	// Choose new image button
	newImageButton = createButton('Choose New Image');
  newImageButton.position(300, 465);
  newImageButton.mousePressed(chooseNewImage);

	// Sort Button
	sortButton = createButton('Sort');
  sortButton.position(650, 250);
  sortButton.mousePressed(sortButtonPressed);

	// Shuffle Button
	shuffleButton = createButton('Shuffle');
  shuffleButton.position(100, height / 2);
  shuffleButton.mousePressed(shuffleImage);

	sortSel = createSelect()
	sortSel.position(550, 250)
	sortSel.option("Bubble");
  sortSel.option("Quick");
  sortSel.option("Merge");
  sortSel.option("Heap");
	sortSel.option("Insertion");
	sortSel.option("Selection");
	sortSel.option("Cocktail");
	sortSel.option("Cycle");
	sortSel.option("Pancake");
  sortSel.changed(sortMethodChanged);

	pixelSlider = createSlider(25, 75, 25, 1)
	pixelSlider.position(75, 420);
	pixelSlider.style('width', '600px');
	pixelSlider.input(updatePixelAmount);

}

function draw() {
	background(200)

	fill(255)
	textSize(56)
	textAlign(CENTER, CENTER);
	noStroke()
	textFont(font)
	text('Sorting Visualizer', width/2, 50)

	textSize(25)
	pixelText = text("Pixels: " + str(pixelAmount) + " x " + str(pixelAmount), 375, 400);

  if (img){
		input.remove()
		pixelSlider.remove()
		newImageButton.show()
		if (sorting){
			newImageButton.hide()
			// Calls upon chosen sorting method generator
			sortMethodDict[sortMethod].next()
		}
		// Image counter variable is used to give time for image to load
		// and change boxPixels array.
		if (imageCounter < 3){
			if (imageCounter == 2){
				getPixels()
			}
			imageCounter += 1
		}
	}
	else{
		newImageButton.hide()
	}
	changePixels()
}

function handleFile(file) {
	// Makes sure given file is image and stores in img variable
  if (file.type === 'image') {
		img = loadImage(file.data, '');
  } else {
    img = null;
  }
}
