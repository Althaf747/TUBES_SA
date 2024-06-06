// Matriks Jarak Antar Area
const AreaDistance = [
    [0, 63, 69, 145, 185, 161, 110, 89, 180, 129],
    [63, 0, 0, 82, 0, 0, 91, 0, 0, 0],
    [69, 0, 0, 0, 0, 0, 0, 57, 0, 110],
    [145, 82, 0, 0, 93, 71, 0, 0, 0, 0],
    [185, 0, 0, 93, 0, 125, 0, 0, 0, 0],
    [161, 0, 0, 71, 125, 0, 110, 0, 132, 0],
    [110, 91, 0, 0, 0, 110, 0, 70, 72, 26],
    [89, 0, 57, 0, 0, 0, 70, 0, 106, 50],
    [180, 0, 0, 0, 0, 132, 72, 106, 0, 0],  
    [129, 0, 110, 0, 0, 0, 26, 50, 0, 0]
  ];

// Matriks Waktu Tempuh
  const walkingTimes = [
    [0, 1, 1, 3, 4, 3, 2, 2, 4, 3],
    [1, 0, 0, 2, 0, 0, 2, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 3],
    [3, 2, 0, 0, 2, 2, 0, 0, 0, 0],
    [4, 0, 0, 2, 0, 3, 0, 0, 0, 0],
    [3, 0, 0, 2, 3, 0, 3, 0, 3, 0],
    [2, 1, 0, 0, 0, 3, 0, 2, 2, 1],
    [2, 0, 1, 0, 0, 0, 2, 0, 3, 1],
    [4, 0, 0, 0, 0, 3, 2, 3, 0, 0],
    [3, 0, 3, 0, 0, 0, 1, 1, 0, 0]
  ];
  
  // Waktu tunggu
  const waitTimes = [0, 40, 30, 50, 30, 40, 70, 35, 40, 10];
  
  // Perkiraan Durasi seluruh permainan di Area 
  const AreadDuration = [0, 20, 30, 40, 10, 20, 25, 25, 30, 20];
  
  // Nama Area
  const AreaNames = ['start', 'Kawasan-Jakarta', 'Kawasan-Dunia-Kartun', 'Kawasan-Amerika', 'Kawasan-Eropa', 'Kawasan-Indonesia', 'Kawasan-Asia', 'Kawasan-Hikayat', 'Kawasan-Yunani', 'Kawasan-Kids-Fantasy'];
  
  // Enumerasi ( indexing ) Area
  const AreaNumbering = Object.fromEntries(AreaNames.map((name, idx) => [name, idx]));
  
  // Fungsi Greedy untuk mencari rute 
  function greedy(start, AreaDistance, waitTimes, walkingTimes, AreadDuration, AreaNumbering, AreaNames, maxTime) {
    const n = AreaDistance.length;
    let currentIdx = AreaNumbering[start];
    const visited = new Set([currentIdx]);
    const path = [start];
    let totalTime = waitTimes[currentIdx] + AreadDuration[currentIdx];
    let totalDistance = 0;
  
    while (true) {
      let nextIdx = null;
      let minDistance = Infinity;
  
      for (let idx = 0; idx < n; idx++) {
        // mengecek apakah route sudah dikunjungi dan nilai jarak != 0
        if (!visited.has(idx) && AreaDistance[currentIdx][idx] > 0) {
          const distance = AreaDistance[currentIdx][idx];
          const tempTime = waitTimes[idx] + walkingTimes[currentIdx][idx] + AreadDuration[idx];
         // mengecek apakah jarak lebih kecil dari min jarak dan tidak melebihi maximum waktu
          if (distance < minDistance && totalTime + tempTime <= maxTime) {
            minDistance = distance;
            nextIdx = idx;
          }
        }
      }

      // jika sudah tidak ada jalur , looping berhenti
      if (nextIdx === null) break;
      const projectedTime = totalTime + waitTimes[nextIdx] + walkingTimes[currentIdx][nextIdx] + AreadDuration[nextIdx];
      // jika waktu > waktu operasional ( max time ), looping berhenti
      if (projectedTime > maxTime) break;
  
      totalTime = projectedTime;
      totalDistance += AreaDistance[currentIdx][nextIdx];
      currentIdx = nextIdx;
      visited.add(currentIdx);
      path.push(AreaNames[currentIdx]);
    }
    
    totalTime += walkingTimes[0][currentIdx]
    totalDistance += AreaDistance[currentIdx][AreaNumbering[start]];
    path.push([start])
  
    if (totalTime > maxTime) {
      return [path.slice(0, -1), null, totalDistance - AreaDistance[currentIdx][AreaNumbering[start]]];
    }
    return [path, totalTime, totalDistance];
  }
  
  // fungsi untuk menghitung waktu dan jarak setiap titik
  function hitungWaktuJarak(path, AreaDistance, waitTimes, walkingTimes, AreadDuration, AreaNumbering) {
    let totalTime = 0;
    let totalDistance = 0;
    for (let i = 0; i < path.length - 1; i++) {
      const currentIdx = AreaNumbering[path[i]];
      const nextIdx = AreaNumbering[path[i + 1]];
      if (AreaDistance[currentIdx][nextIdx] === 0) return [Infinity, Infinity];
      totalTime += waitTimes[nextIdx] + walkingTimes[currentIdx][nextIdx] + AreadDuration[nextIdx];
      totalDistance += AreaDistance[currentIdx][nextIdx];
    }
    return [totalTime, totalDistance];
  }
  
  // fungsi untuk menemukan semua jalur
  function semuaJalur(arr) {
    if (arr.length === 0) return [[]];
    const jalur = [];
    for (let i = 0; i < arr.length; i++) {
      // mengambil array arr dan menghapus elemen di indeks i, lalu menggabungkan dua bagian array yang terpisah akibat penghapusan elemen 
      //tersebut untuk menghasilkan array baru tanpa elemen tersebut.
      const remainingElements = arr.slice(0, i).concat(arr.slice(i + 1));
      for (const p of semuaJalur(remainingElements)) {
        jalur.push([arr[i]].concat(p));
      }
    }
    return jalur;
  }
  
  // fungsi bruteforce untuk menemukan jalur optimal
function bruteForce(start, AreaDistance, waitTimes, walkingTimes, AreadDuration, AreaNumbering, AreaNames, maxTime) {
  // membuat array baru tanpa area pertama ( start )
  const allRides = AreaNames.slice(1);
  // membuat semua permutasi dari area yang ada
  const jalur = semuaJalur(allRides);

  // inisialisasi variabel untuk menyimpan hasil terbaik
  let bestPath = [];
  let bestNumRides = 0;
  let minDistance = Infinity;
  let bestTotalTime = Infinity;
  const allPossiblePaths = [];

  // loop melalui setiap permutasi jalur
  for (const perm of jalur) {
    // loop untuk memeriksa setiap sub-jalur dari 1 hingga panjang jalur
    for (let i = 1; i <= perm.length; i++) {
      // membuat jalur dari start, sub-jalur, dan kembali ke start
      const path = [start].concat(perm.slice(0, i)).concat([start]);
      const [totalTime, totalDistance] = hitungWaktuJarak(path, AreaDistance, waitTimes, walkingTimes, AreadDuration, AreaNumbering);
      allPossiblePaths.push([path, totalTime, totalDistance]);
      // jika total waktu kurang dari atau sama dengan waktu maksimal
      if (totalTime <= maxTime) {
        // hitung jumlah wahana yang bisa dikunjungi
        const numRides = i;
        // jika jumlah wahana lebih banyak atau jika sama tetapi jaraknya lebih pendek
        if (numRides > bestNumRides || (numRides === bestNumRides && totalDistance < minDistance)) {
          // update hasil terbaik
          bestNumRides = numRides;
          minDistance = totalDistance;
          bestPath = path;
          bestTotalTime = totalTime;
        }
      }
    }
  }
    return [allPossiblePaths, bestPath, bestTotalTime, minDistance];
  }
  
const canvas = document.getElementById("pathCanvas");
const ctx = canvas.getContext("2d");

const lines = document.querySelectorAll(".line");

// Fungsi untuk mendapatkan posisi area berdasarkan id area
function getareaPosition(areaId) {
    const areaElement = document.getElementById(areaId);
    // Jika elemen area ditemukan
    if (areaElement) {
        const rect = areaElement.getBoundingClientRect();
        const containerRect = document.getElementById('container').getBoundingClientRect();
        // Menghitung posisi tengah elemen area relatif terhadap kontainer
        return {
            x: rect.left + rect.width / 2 - containerRect.left,
            y: rect.top + rect.height / 2 - containerRect.top
        };
    }
    // Mengembalikan null jika elemen area tidak ditemukan
    return null;
}

// untuk ngegambar garis
function drawLine(fromPos, toPos, distance, color) {
  ctx.beginPath();
  ctx.moveTo(fromPos.x, fromPos.y);
  ctx.lineTo(toPos.x, toPos.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();

  // menentukan jarak , tujuan garis
  const midX = (fromPos.x + toPos.x) / 2;
  const midY = (fromPos.y + toPos.y) / 2;
  const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
  const offsetX = 5 * Math.cos(angle + Math.PI / 2);
  const offsetY = 5 * Math.sin(angle + Math.PI / 2);
  const textX = midX + offsetX;
  const textY = midY + offsetY;

  // menuliskan teks jarak pada tengah garis
  ctx.font = '16px Arial';
  ctx.fillStyle = '#f5f5f5';
  ctx.fillText(distance, textX, textY);
}


function drawAllLines() {
  // Membersihkan canvas sebelum menggambar
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  lines.forEach(line => {
      // Mendapatkan posisi awal dan akhir garis berdasarkan atribut data
      const fromPos = getareaPosition(line.getAttribute('data-from'));
      const toPos = getareaPosition(line.getAttribute('data-to'));
      const distance = line.getAttribute('data-distance') || ''; 
      // Jika posisi awal dan akhir valid, menggambar garis
      if (fromPos && toPos) {
          drawLine(fromPos, toPos, distance, 'rgba(255, 255, 255, 0.35)');
      }
  });
}

// menggambar seluruh garis
drawAllLines();


// fungsi untuk menggambar garis dari jalur dengan Greedy
document.getElementById('Greedy').addEventListener('click',function(){
    const max_time = parseInt(document.getElementById('jaminput').value)
    const [shortestPath, totalTime, totalDistance2] = greedy('start', AreaDistance, waitTimes, walkingTimes, AreadDuration, AreaNumbering, AreaNames, max_time);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAllLines(); 
    Btext.style.display = "none"; 
    function animateRedPath(path, index = 0) {
        if (index < path.length - 1) {
            const fromPos = getareaPosition(path[index]);
             const toPos = getareaPosition(path[index + 1]);
             if (fromPos && toPos) {
                 drawAnimatedLine(fromPos, toPos, '', '#FF7D29', () => {
                    animateRedPath(path, index + 1);
                });
            }
        }
    }
    // fungsi untuk menambahkan animasi pada garis
    function drawAnimatedLine(fromPos, toPos, distance, color, callback) {
        const totalFrames = 75;
        let currentFrame = 0;
    
        function animate() {
            currentFrame++;
            const progress = currentFrame / totalFrames;
            const currentX = fromPos.x + (toPos.x - fromPos.x) * progress;
            const currentY = fromPos.y + (toPos.y - fromPos.y) * progress;
    
            ctx.beginPath();
            ctx.moveTo(fromPos.x, fromPos.y);
            ctx.lineTo(currentX, currentY);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
    
            if (currentFrame < totalFrames) {
                requestAnimationFrame(animate);
            } else if (callback) {
                 callback();
            }
        }
        animate();
    }

    animateRedPath(shortestPath)
    const pathstr = shortestPath.join(' -> ') 
    document.getElementById('jalur').textContent = 'Jalur : ' + pathstr ;
    document.getElementById('waktu').textContent = 'Waktu : ' + totalTime;
    document.getElementById('jarak').textContent = 'jarak : ' + totalDistance2;
    modal.style.display = "block";
    Gtext.style.display = "block";
});

// fungsi untuk menggambar jalur yang ditemukan oleh Brute Force
document.getElementById('Brute-Force').addEventListener('click',function(){
    const max_time = parseInt(document.getElementById('jaminput').value)
    const [allPaths, bestPath, bestTotalTime, totalDistance] = bruteForce('start', AreaDistance, waitTimes, walkingTimes, AreadDuration, AreaNumbering, AreaNames, max_time);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Gtext.style.display = "none"; 
    drawAllLines();
    function animateRedPath(path, index = 0) {
        if (index < path.length - 1) {
            const fromPos = getareaPosition(path[index]);
             const toPos = getareaPosition(path[index + 1]);
             if (fromPos && toPos) {
                 drawAnimatedLine(fromPos, toPos, '', '#FF7D29', () => {
                    animateRedPath(path, index + 1);
                });
            }
        }
    }
  
    function drawAnimatedLine(fromPos, toPos, distance, color, callback) {
        const totalFrames = 75;
        let currentFrame = 0;
    
        function animate() {
            currentFrame++;
            const progress = currentFrame / totalFrames;
            const currentX = fromPos.x + (toPos.x - fromPos.x) * progress;
            const currentY = fromPos.y + (toPos.y - fromPos.y) * progress;
    
            ctx.beginPath();
            ctx.moveTo(fromPos.x, fromPos.y);
            ctx.lineTo(currentX, currentY);
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.stroke();
    
            if (currentFrame < totalFrames) {
                requestAnimationFrame(animate);
            } else if (callback) {
                 callback();
            }
        }
        animate();
    }


    animateRedPath(bestPath)
    const pathstr = bestPath.join(' -> ') 
    document.getElementById('jalur').textContent = 'Jalur : ' + pathstr ;
    document.getElementById('waktu').textContent = 'Waktu : ' + bestTotalTime;
    document.getElementById('jarak').textContent = 'jarak : ' + totalDistance;
    modal.style.display = "block";
    Btext.style.display = "block";   
});

// fungsi untuk membersihkan layar canvas
document.getElementById('Clear').addEventListener('click',function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAllLines(); 
})

var Btext = document.getElementById('text-brute')
var Gtext = document.getElementById('text-greedy')

var modal = document.getElementById("myModal");
var btn = document.getElementById("Greedy");
var span = document.getElementsByClassName("close")[0];
btn.onclick = function() {
  modal.style.display = "block";
}
span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}