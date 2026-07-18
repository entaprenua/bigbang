import {
  Categories, Category, CategorySubcategories,
  CategoryName, CategoryImage
} from "~/components/ui/category"
import { CollectionItems, CollectionContent } from "~/components/ui/collection"
import { Grid, Col } from "~/components/ui/grid"
import {
  Popover, PopoverTrigger, PopoverContent, PopoverCloseButton,
  PopoverTitle, PopoverArrow
} from "~/components/ui/popover"
import { Suspense } from "solid-js"


export default function CategoriesTree() {
  return (
    <Popover>
      <Categories>
        <CollectionContent>
          <PopoverTrigger> Categories </PopoverTrigger>
          <PopoverContent class="max-h-150 max-w-[80vw] w-full overflow-auto">
            <PopoverArrow />
            <Suspense fallback={"Loading categories"}>
              <Grid colsSm={2} cols={2} colsLg={4} colsXl={5}>
                <CollectionItems>
                  <Col class="m-3">
                    <Category href="categories">
                      <CategoryImage class="h-20 w-20" />
                      <CategoryName />
                      <CategorySubcategories>
                        <div class="flex flex-wrap gap-2">
                          <CollectionItems>
                            <Category>
                              <div class="flex items-center gap-4">
                                <CategoryImage class="w-16 h-16 object-cover" />
                                <div class="flex-1">
                                  <CategoryName class="text-lg font-semibold block" />
                                </div>
                              </div>
                              <CategorySubcategories>
                                <CollectionItems>
                                  <Category href={"categories"}>
                                    <CategorySubcategories>
                                      <CollectionItems>
                                        <Category>
                                          <div class="flex items-center gap-3">
                                            <CategoryImage class="w-10 h-10 object-cover" />
                                            <CategoryName class="font-medium block" />
                                          </div>
                                          <CategorySubcategories>
                                            <CollectionItems>
                                              <Category href="categories">
                                                <CategorySubcategories>
                                                  <CollectionItems>
                                                    <Category>
                                                      <div class="flex items-center gap-2 py-1">
                                                        <CategoryName class="block" />
                                                      </div>
                                                    </Category>
                                                  </CollectionItems>
                                                </CategorySubcategories>
                                              </Category>
                                            </CollectionItems>
                                          </CategorySubcategories>
                                        </Category>
                                      </CollectionItems>
                                    </CategorySubcategories>
                                  </Category>
                                </CollectionItems>
                              </CategorySubcategories>
                            </Category>
                          </CollectionItems>
                        </div>
                      </CategorySubcategories>
                    </Category>
                  </Col>
                </CollectionItems>
              </Grid>
            </Suspense>
          </PopoverContent>
        </CollectionContent>
      </Categories>
    </Popover>
  )
}
