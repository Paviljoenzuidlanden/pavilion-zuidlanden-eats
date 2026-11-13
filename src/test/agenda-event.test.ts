import { describe, expect, it } from "vitest";
import { kerstfreubelEvent, pubquizJanuariEvent, pubquizFebruariEvent, pubquizMaartEvent, eindejaarsborrelEvent } from "@/pages/Agenda";

describe("Kerstfreubelavond", () => {
  it("vindt plaats op 26 november van 19:30 tot 22:30", () => {
    expect(kerstfreubelEvent.date).toBe("26");
    expect(kerstfreubelEvent.month).toBe("Nov");
    expect(kerstfreubelEvent.time).toBe("19:30 – 22:30");
  });
  it("kost 22,50 per persoon", () => {
    expect(kerstfreubelEvent.pricePerPerson).toBe(22.5);
  });
  it("omvat twee consumpties", () => {
    expect(kerstfreubelEvent.includedDrinks).toBe(2);
  });
});

describe("Pubquiz januari", () => {
  it("vindt plaats op 14 januari", () => {
    expect(pubquizJanuariEvent.date).toBe("14");
    expect(pubquizJanuariEvent.month).toBe("Jan");
    expect(pubquizJanuariEvent.title).toBe("Zuidlanden Pubquiz");
  });
  it("heeft nog geen aanmeldingsknop", () => {
    expect(pubquizJanuariEvent.hideSignup).toBe(true);
  });
  it("laat het thema nog open", () => {
    expect(pubquizJanuariEvent.description).toContain("Thema volgt nog");
  });
});

describe("Pubquiz februari", () => {
  it("vindt plaats op 11 februari", () => {
    expect(pubquizFebruariEvent.date).toBe("11");
    expect(pubquizFebruariEvent.month).toBe("Feb");
    expect(pubquizFebruariEvent.title).toBe("Zuidlanden Pubquiz");
  });
  it("heeft nog geen aanmeldingsknop", () => {
    expect(pubquizFebruariEvent.hideSignup).toBe(true);
  });
  it("staat in het teken van liefde en Valentijnsdag", () => {
    expect(pubquizFebruariEvent.description).toContain("liefde");
    expect(pubquizFebruariEvent.description).toContain("Valentijnsdag");
  });
});

describe("Pubquiz maart", () => {
  it("vindt plaats op 11 maart", () => {
    expect(pubquizMaartEvent.date).toBe("11");
    expect(pubquizMaartEvent.month).toBe("Mrt");
    expect(pubquizMaartEvent.title).toBe("Zuidlanden Pubquiz");
  });
  it("staat onder voorbehoud", () => {
    expect(pubquizMaartEvent.description).toContain("onder voorbehoud");
  });
  it("heeft nog geen aanmeldingsknop", () => {
    expect(pubquizMaartEvent.hideSignup).toBe(true);
  });
});

describe("Eindejaarsborrel", () => {
  it("vindt plaats op 31 december", () => {
    expect(eindejaarsborrelEvent.date).toBe("31");
    expect(eindejaarsborrelEvent.month).toBe("Dec");
    expect(eindejaarsborrelEvent.title).toBe("Eindejaarsborrel");
  });
  it("meldt dat meer informatie volgt", () => {
    expect(eindejaarsborrelEvent.description).toContain("Meer informatie volgt nog");
  });
  it("heeft nog geen aanmeldingsknop", () => {
    expect(eindejaarsborrelEvent.hideSignup).toBe(true);
  });
});
