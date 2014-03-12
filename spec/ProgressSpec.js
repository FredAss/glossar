describe("ProgressCounter", function() {
  var p;

  beforeEach(function(){
    p = new progressCounter(12);
  });

  it("should have the term count that is given to it", function(){
    expect(p.numberOfTerms).toEqual(12);
  });
  it("should count new terms", function(){
    p.registerTerm("a");
    p.registerTerm("b");
    p.registerTerm("c");
    expect(p.numberOfTermsRead()).toEqual(3);
  });
  it("should not count terms that it has already counted", function(){
    p.registerTerm("a");
    p.registerTerm("b");
    p.registerTerm("a");
    expect(p.numberOfTermsRead()).toEqual(2);
  });
});
