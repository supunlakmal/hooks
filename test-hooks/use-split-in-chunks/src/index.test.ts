import { useSplitInChunks } from "./";
import { renderHook, act } from "@testing-library/react-hooks";

describe("useSplitInChunks", () => {
  it("splits in chunks of 2", () => {
    let names = ["Ted", "Tracy", "Marshal", "Lily", "Barney", "Robin"];
    const { result } = renderHook(() => useSplitInChunks(names, 2));

    expect(result.current.chunks.length).toBe(3);

    act(() => {
      names = ["Harry", "Hermione", "Ron"];
      result.current.setArray(names);
    });

    expect(result.current.chunks.length).toBe(2);
  });

  it("splits in chunks of n", () => {
    let names = ["Ted", "Tracy", "Marshal", "Lily", "Barney", "Robin"];
    const { result } = renderHook(() => useSplitInChunks(names, 2));

    expect(result.current.chunks.length).toBe(3);

    act(() => {
      result.current.setSize(3);
    });

    expect(result.current.chunks.length).toBe(2);

    act(() => {
      result.current.setSize(1);
    });

    expect(result.current.chunks.length).toBe(6);
  });

  it("throws error on chunkSize 0", () => {
    let names = ["Ted", "Tracy", "Marshal", "Lily", "Barney", "Robin"];
    const { result } = renderHook(() => useSplitInChunks(names, 0));

    expect(result.error).toEqual(Error("chunkSize should be greater than 0"));
  });

  it("throws error on not an array", () => {
    const { result } = renderHook(() =>
      useSplitInChunks((undefined as unknown) as [], 2)
    );

    expect(result.error).toEqual(Error("first argument should be an array"));
  });
});
