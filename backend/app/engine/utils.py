from functools import wraps


def has_flow_instance(func):
    @wraps(func)
    def wrapper(self, *args, **kwargs):
        if not self.flow_instance:
            raise ValueError("Flow instance is not set. Please set up the flow instance before calling this method.")
        return func(self, *args, **kwargs)
    return wrapper