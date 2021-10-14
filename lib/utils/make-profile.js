export default makeProfile = function(fn, fnName){
  const fnComplete = function(){
    try{
      console.time(`PROFILE - ${fnName}`);
      const fnApplied = fn.apply(this, arguments);
      console.timeEnd(`PROFILE - ${fnName}`);
      return fnApplied;
    }catch(ex){
      // ErrorHandler.Exception(ex);
      console.log(ex);
    }
  };
  return fnComplete;
};