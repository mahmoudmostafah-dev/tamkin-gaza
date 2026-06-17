import toast from "react-hot-toast";

class AsyncWrapper {
  api(fn: () => Promise<any>) {
    return async () => {
      try {
        const res = await fn();
        return res;
      } catch (error) {
        console.log(`error on async wrapper :`, error);
      }
    };
  }

  toast(fn: () => Promise<any>) {
    return async () => {
      try {
        const res = await fn();
        toast.success("Success");
        return res;
      } catch (error) {
        toast.error("Error");
      }
    };
  }
}

export default new AsyncWrapper();
