const pr1 = new Promise((resolve) => {
  setTimeout(() => resolve(1), 100);
});
const pr2 = new Promise((resolve) => {
  setTimeout(() => resolve(2), 200);
});
const pr3 = new Promise((resolve) => {
  setTimeout(() => resolve(3), 300);
});
const funcPromise = async (a) => {
  await new Promise((resolve) => {
    setTimeout(() => resolve(), 100);
  });
  await new Promise((resolve) => {
    setTimeout(() => resolve(), 50);
  });
  return await new Promise((resolve) => {
    setTimeout(() => resolve(a), 300);
  });
};

const abc = ["a", "b", "c"];
const abcPromise = abc.map(async (b) => {
  return await funcPromise(b);
});

const func = async () => {
  for (const rr of abcPromise) {
    console.log(await rr);
  }
};

func();
